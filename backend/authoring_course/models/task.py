from django.db import models
from authoring_task.models import AbstractTask
from authoring_course.models import Course


class CourseTask(AbstractTask):
    course = models.ForeignKey(
        Course,
        related_name='tasks',
        null=False,
        on_delete=models.CASCADE
    )

    def _get_payload(self):
        return { **super()._get_payload(), 'id_course': self.course.external_id }