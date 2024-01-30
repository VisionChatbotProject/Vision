
from rest_framework import serializers
from authoring_task.serializers import TaskSerializer
from authoring_course.models import CourseTask

class CourseTaskSerializer(TaskSerializer):
    course = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = CourseTask
        fields = TaskSerializer.Meta.fields + ['course']