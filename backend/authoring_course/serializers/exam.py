
from rest_framework import serializers
from authoring_exam.serializers import ExamSerializer
from authoring_course.models import CourseExam

class CourseExamSerializer(ExamSerializer):
    course = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = CourseExam
        fields = ExamSerializer.Meta.fields + ['course']