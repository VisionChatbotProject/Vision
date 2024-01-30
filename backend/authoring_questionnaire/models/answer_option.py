from django.db import models
from authoring_core.models import AbstractSynchronizableBase
from authoring_core.models import SynchronizationDefinition
from authoring_core.models import AbstractAuditable
from authoring_questionnaire.models.question import ChoiceQuestion
from smartstudy_assets.models import Asset
from polymorphic.models import PolymorphicModel

class AnswerOption(PolymorphicModel, AbstractAuditable, AbstractSynchronizableBase):
    question = models.ForeignKey(
        ChoiceQuestion, 
        null=False, 
        on_delete=models.CASCADE, 
        related_name='answer_options'
    )

    text = models.TextField(
        blank=True
    )

    asset = models.OneToOneField(
        Asset, 
        null=True, 
        on_delete=models.SET_NULL, 
        related_name='answer_option'
    )

    correct_answer = models.BooleanField(
        default=False
    )

    def _get_synchonization_definition(self):
        return SynchronizationDefinition('answer')
    
    def _get_payload(self):
        return {
            "question_id": self.question.external_id,
            "answer_text": self.text,
            "is_correct": 1
        }

