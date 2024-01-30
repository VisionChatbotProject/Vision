from rest_framework import serializers
from authoring_questionnaire.models import Questionnaire
from authoring_course.models import Chapter

class QuestionnaireSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    course = serializers.PrimaryKeyRelatedField(read_only=True, allow_null=True)
    chapter = serializers.PrimaryKeyRelatedField(allow_null=True, queryset = Chapter.objects.all())

    title = serializers.CharField(max_length=255)

    createdBy = serializers.PrimaryKeyRelatedField(read_only=True, source='created_by')
    createdAt = serializers.DateTimeField(read_only=True, source='created_at')
    modifiedAt = serializers.DateTimeField(read_only=True, source='modified_at')

    class Meta:
        model = Questionnaire
        fields = ['id','course', 'chapter', 'title', 'createdBy', 'createdAt', 'modifiedAt']

    def save(self, **kwargs):
        kwargs['course_id'] = self.context['courseId']
        return super().save(**kwargs)