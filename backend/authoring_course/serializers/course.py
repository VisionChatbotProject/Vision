from django.db.models.base import Model
from django.urls import reverse

from rest_framework import serializers

from smartstudy_assets.serializers import MinimalAssetModelField
from smartstudy_assets.serializers import AssetServingMixin
from smartstudy_assets.serializers import AssetSerializer
from authoring_course.models import Course
   
class CourseSerializer(serializers.ModelSerializer, AssetServingMixin):
    id = serializers.IntegerField(read_only=True)
    
    name = serializers.CharField(max_length=255)
    
    shortDescription = serializers.CharField(source='short_description')
    longDescription = serializers.CharField(source='long_description')
    
    image = MinimalAssetModelField(required=False, allow_null=True)
    
    organization = serializers.PrimaryKeyRelatedField(read_only=True)
    createdBy = serializers.PrimaryKeyRelatedField(read_only=True, source='created_by')
    
    createdAt = serializers.DateTimeField(read_only=True, source='created_at')
    modifiedAt = serializers.DateTimeField(read_only=True, source='modified_at')

    courseBeginDate = serializers.DateTimeField(required=False, allow_null=True, source='course_begin_date')
    courseEndDate = serializers.DateTimeField(required=False, allow_null=True, source='course_end_date')

    materials = serializers.CharField(required=False, allow_blank=True)
    ressources = serializers.CharField(required=False, allow_blank=True)

    teacherName = serializers.CharField(required=False, allow_blank=True, source='teacher_name')
    teacherEmail = serializers.EmailField(required=False, allow_blank=True, source='teacher_email')

    def get_serve_url(self, instance):
        course = instance.course
        path = reverse('serve_course_image', kwargs={'courseId' : course.id, 'assetPk' : instance.pk } )
        return path

    def get_fallback_url(self, parent):
        return None
    
    class Meta:
        model: Model = Course
        fields: list = ['id', 'name', 'shortDescription', 'longDescription', 'image', 
            'organization', 'createdBy', 'createdAt', 'modifiedAt',
            'courseBeginDate','courseEndDate', 'materials', 'ressources', 'teacherName', 'teacherEmail'
        ]



class CourseAssetSerializer(AssetSerializer):
    def get_serve_url(self, instance):
        courseId = self.context['courseId']
        path = reverse('serve_course_asset', kwargs={'courseId' : courseId, 'filename' : instance.name } )
        return path
    
    def get_asset_file_serve_url(self, instance):
        courseId = self.context['courseId']
        path = reverse('serve_course_asset', kwargs={'courseId' : courseId, 'filename' : instance.name } )
        return path
    
    def get_fallback_url(self, parent):
        return None

    class Meta(AssetSerializer.Meta):
        fields = ['file']