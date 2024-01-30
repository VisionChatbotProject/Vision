from django.db import models

from authoring_core.models import AbstractAuditable
from authoring_core.models import AbstractSynchronizableBase
from authoring_core.models.synchronization import SynchronizationDefinition

class AbstractTask(AbstractAuditable, AbstractSynchronizableBase):

    title = models.CharField(
        max_length=200,
        help_text='Specifies the title of this task'
    )

    description = models.TextField(
        help_text='The description for this task'
    )

    resources = models.TextField(
        help_text='The observation for this task'
    )

    deadline = models.DateField(
        help_text='The deadline for this task'
    )

    is_active = models.BooleanField(
        help_text='The switch if the task is active'
    )

    def _get_synchonization_definition(self):
        return SynchronizationDefinition('task')

    def _get_payload(self):
        return {
            'title': self.title,
            'description': self.description,
            'resources': self.resources,
            'active': self.is_active,
            'deadline': self.deadline,
            'id_course': -1,
            'id_chapter': -1, # TODO: Check
        }

    class Meta:
        abstract = True




