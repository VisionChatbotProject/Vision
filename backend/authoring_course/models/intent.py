from django.db import models
from authoring_intent.models import AbstractIntent
from authoring_course.models import Course, Chapter


class CourseIntent(AbstractIntent):
    course = models.ForeignKey(
        Course,
        related_name='intents',
        null=False,
        on_delete=models.CASCADE
    )

    chapter = models.OneToOneField(
        Chapter,
        related_name='intent',
        null=True,
        on_delete=models.CASCADE,
        default=None
    )

    def _get_payload(self):
        chapter = self.chapter.external_id if self.chapter is not None else -1
        return {
            **super()._get_payload(),
            'id_course': self.course.external_id,
            'id_chapter': chapter,
        }