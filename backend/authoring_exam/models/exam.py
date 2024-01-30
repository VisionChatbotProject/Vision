from django.db import models

from authoring_core.models import AbstractAuditable
from authoring_core.models import AbstractSynchronizableBase
from authoring_core.models.synchronization import SynchronizationDefinition

class AbstractExam(AbstractAuditable, AbstractSynchronizableBase):

    class ExamTypes(models.TextChoices):
        WRITTEN = "W", ("Written")
        ORAL = "O", ("Oral")

    name = models.CharField(
        max_length=200,
        help_text='Specifies the name of this exam'
    )

    description = models.TextField(
        help_text='The description for this exam'
    )

    observation = models.TextField(
        help_text='The observation for this exam'
    )

    date = models.DateTimeField(
        help_text='The date and time for this exam'
    )

    is_active = models.BooleanField(
        help_text='The switch if the exam is active'
    )

    type = models.CharField(
        max_length=1,
        choices=ExamTypes.choices,
        default=ExamTypes.WRITTEN,
    )

    def _get_synchonization_definition(self):
        return SynchronizationDefinition('exam')

    def _get_payload(self):
        chapter = self.chapter.external_id if self.chapter is not None else -1
        return {
            'name': self.name,
            'description': self.description,
            'observation': self.observation,
            'active': self.is_active,
            'date': self.date,
            'id_course': self.course.external_id,
            'id_chapter': chapter,
        }

    class Meta:
        abstract = True




