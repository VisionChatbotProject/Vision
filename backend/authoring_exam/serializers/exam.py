from rest_framework import serializers
from authoring_exam.models import AbstractExam


class ExamSerializer(serializers.ModelSerializer):
    name = serializers.CharField()
    description = serializers.CharField
    observation = serializers.CharField
    date = serializers.DateTimeField(format="%Y-%m-%dT%H:%M")
    isActive = serializers.BooleanField(source='is_active')

    class Meta:
        model = AbstractExam
        fields = ['id', 'name', 'description', 'observation', 'observation', 'date', 'isActive']