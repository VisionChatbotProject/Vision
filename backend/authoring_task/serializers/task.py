from rest_framework import serializers
from authoring_task.models import AbstractTask

class TaskSerializer(serializers.ModelSerializer):
    title = serializers.CharField()
    description = serializers.CharField
    resources = serializers.CharField
    deadline = serializers.DateField
    isActive = serializers.BooleanField(source='is_active')

    class Meta:
        model = AbstractTask
        fields = ['id', 'title', 'description', 'resources', 'deadline', 'isActive']