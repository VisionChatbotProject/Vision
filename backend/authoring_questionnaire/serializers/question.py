from rest_framework import serializers
from authoring_questionnaire.models import ChoiceQuestion

from smartstudy_assets.serializers import MinimalAssetModelField
from smartstudy_assets.serializers import AssetServingMixin
from authoring_core.serializers import AuditableSerializer
from rest_polymorphic.serializers import PolymorphicSerializer

from django.urls import reverse


class QuestionSerializer(AuditableSerializer, serializers.ModelSerializer, AssetServingMixin):
   
    title = serializers.CharField(max_length=255)
    text = serializers.CharField()

    questionnaire = serializers.PrimaryKeyRelatedField(read_only=True)
    asset = MinimalAssetModelField(required=False, allow_null=True)

    def get_serve_url(self, instance):
        question = instance.question
        path = reverse('serve_question_image', kwargs={ 'questionId' : question.id, 'assetPk' : instance.pk })
        return path
    
    def get_fallback_url(self, parent):
        return None

    class Meta(AuditableSerializer.Meta):
        model = ChoiceQuestion
        fields = ['id', 'questionnaire', 'title', 'text', 'asset'] + AuditableSerializer.Meta.fields

class PolymorphicQuestionSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        ChoiceQuestion : QuestionSerializer,
        # TODO: later on, add a normal question serializer. 
    }
