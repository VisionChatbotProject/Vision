from rest_framework import serializers
from django.db.models.base import Model
from django.urls import reverse
from ordered_model.serializers import OrderedModelSerializer

from authoring_course.models import Slide
from smartstudy_assets.serializers import MinimalAssetModelField

from smartstudy_assets.serializers import AssetServingMixin

class SlideSerializer(OrderedModelSerializer, AssetServingMixin):

    title = serializers.CharField(max_length=255)

    content = MinimalAssetModelField(allow_null=True, required=False)

    createdBy = serializers.PrimaryKeyRelatedField(read_only=True, source='created_by')

    createdAt = serializers.DateTimeField(read_only=True, source='created_at')
    modifiedAt = serializers.DateTimeField(read_only=True, source='modified_at')

    order = serializers.IntegerField(required=False)

    def get_serve_url(self, instance):
        slide = instance.slide
        path = reverse('serve_slide_asset', kwargs={'slideId' : slide.id } )
        return path

    def get_fallback_url(self, slide):
        path = reverse('serve_slide_asset', kwargs={'slideId' : slide.id } )
        return path

    class Meta:
        model: Model = Slide
        fields: list = ['id', 'title', 'content', 'createdBy', 'createdAt', 'modifiedAt', 'order']
