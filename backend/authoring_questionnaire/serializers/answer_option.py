from django.db.models.base import Model
from django.urls import reverse

from rest_framework import serializers
from rest_polymorphic.serializers import PolymorphicSerializer
from authoring_core.serializers import AuditableSerializer
from smartstudy_assets.serializers import AssetServingMixin
from smartstudy_assets.serializers.asset import MinimalAssetModelField

from authoring_questionnaire.models import AnswerOption

class AnswerOptionSerializer(AuditableSerializer, serializers.ModelSerializer, AssetServingMixin):
    question = serializers.PrimaryKeyRelatedField(read_only=True)
    asset = MinimalAssetModelField(required=False, allow_null=True)
    text = serializers.CharField()
    correctAnswer = serializers.BooleanField(source='correct_answer')

    def get_serve_url(self, instance):
        answer_option = instance.answer_option
        path= reverse('serve_answer_option_image', kwargs={'answerOptionId': answer_option.id, 'assetPk': instance.pk})
        return path

    class Meta(AuditableSerializer.Meta):
        model: Model = AnswerOption
        fields: list = ['id', 'question', 'text', 'asset', 'correctAnswer'] + AuditableSerializer.Meta.fields


class AnswerOptionPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        AnswerOption : AnswerOptionSerializer,
    }