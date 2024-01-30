from rest_framework import serializers
from django.db.models.base import Model
from authoring_course.models import Chapter
from ordered_model.serializers import OrderedModelSerializer


class ChapterField(serializers.PrimaryKeyRelatedField):
    def get_queryset(self):
        courseId = self.context['courseId']
        return Chapter.objects.filter(course_id=courseId)


class ChapterSerializer(OrderedModelSerializer):
    id = serializers.IntegerField(read_only=True)

    title = serializers.CharField(max_length=255)

    shortDescription = serializers.CharField(source='short_description')
    longDescription = serializers.CharField(source='long_description')

    course = serializers.PrimaryKeyRelatedField(read_only=True)
    parent = ChapterField(required=False, allow_null=True)

    createdBy = serializers.PrimaryKeyRelatedField(read_only=True, source='created_by')

    createdAt = serializers.DateTimeField(read_only=True, source='created_at')
    modifiedAt = serializers.DateTimeField(read_only=True, source='modified_at')

    order = serializers.IntegerField(required=False)

    class Meta:
        model: Model = Chapter
        fields: list = ['id', 'title', 'shortDescription', 'longDescription',
                        'course', 'parent', 'createdBy', 'createdAt', 'modifiedAt', 'order']

    def save(self, **kwargs):
        kwargs['course_id'] = self.context['courseId']
        return super().save(**kwargs)
