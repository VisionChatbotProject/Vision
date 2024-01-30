from django.db import models
from polymorphic.models import PolymorphicModel
from authoring_core.models import AbstractAuditable
from authoring_core.models import AbstractSynchronizableBase
from authoring_core.models import SynchronizationDefinition
from authoring_questionnaire.models.questionnaire import Questionnaire
from smartstudy_assets.models import Asset

class Question(PolymorphicModel, AbstractAuditable, AbstractSynchronizableBase):
    '''
    Question base model.

    This model represents the base for all questions and can be used on its own
    and makes the most sense in the context of an open question (like in surveys, or feedback), 
    Example "What did you like about this course?"
    '''    

    questionnaire = models.ForeignKey(Questionnaire, null=False, on_delete=models.CASCADE, related_name='questions')
        
    title = models.CharField(max_length=255)
    text = models.TextField()
    
    asset = models.OneToOneField(Asset, null=True, on_delete=models.SET_NULL, related_name='question')

    def _get_synchonization_definition(self):
        return SynchronizationDefinition('question')
    
    def _get_payload(self):
        return {
            "quiz_id": self.questionnaire.external_id,
            "question_text": self.text
        }


class ChoiceQuestion(Question):
    '''
    Choice question model
    Represents a question that has fixed answer options. None, one or many answer options might be correct.
    '''    
    pass
