from django.db import models

from authoring_core.models import AbstractAuditable
from authoring_core.models import AbstractSynchronizableBase
from authoring_core.models.synchronization import SynchronizationDefinition
class AbstractIntent(AbstractAuditable, AbstractSynchronizableBase):

    name = models.CharField(
        max_length=200,
        help_text='Specifies the name of this intent'
    )

    intents = models.JSONField(
        help_text='A json array field holding all intents'
    )

    response = models.TextField(
        help_text='The response for this intent'
    )

    is_question = models.BooleanField(
        help_text='The switch if it is a question',
        default=False
    )

    def _get_synchonization_definition(self):
        return SynchronizationDefinition('intent')
    
    def _get_payload(self):
        return {
            'intent_name': self.name,
            'intent_list': ','.join(self.intents),
            'is_quiz': self.is_question,
            'response': self.response,
            'id_course': -1,
            'id_chapter': -1, 
        }

    class Meta:
        abstract = True




