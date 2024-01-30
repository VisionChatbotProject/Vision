
from rest_framework import serializers
from authoring_intent.serializers import IntentSerializer
from authoring_course.models import CourseIntent
from authoring_course.models import Chapter

class CourseIntentSerializer(IntentSerializer):
    course = serializers.PrimaryKeyRelatedField(read_only=True)
    chapter = serializers.PrimaryKeyRelatedField(allow_null=True, queryset = Chapter.objects.all())

    class Meta:
        model = CourseIntent
        fields = IntentSerializer.Meta.fields + ['course', 'chapter']