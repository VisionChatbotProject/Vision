from django.db import models
from authoring_exam.models import AbstractExam
from authoring_course.models import Course


class CourseExam(AbstractExam):
    course = models.ForeignKey(
        Course,
        related_name='exams',
        null=False,
        on_delete=models.CASCADE
    )

    def _get_payload(self):
        # return { **super()._get_payload(), 'id_course': self.course.external_id }
        return {
            'name': self.name,
            'description': self.description,
            'observation': self.observation,
            'active': self.is_active,
            'date': self.date,
            'id_course': self.course.external_id,
            'id_chapter': self.course.external_id,
        }