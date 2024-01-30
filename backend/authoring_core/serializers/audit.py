from rest_framework import serializers

from authoring_core.models import AbstractAuditable

class AuditableSerializer(serializers.Serializer):
    createdBy = serializers.PrimaryKeyRelatedField(read_only=True, source='created_by')
    modifiedBy = serializers.PrimaryKeyRelatedField(read_only=True, source='modified_by')
    modifiedAt = serializers.DateTimeField(read_only=True, source='modified_at')
    createdAt = serializers.DateTimeField(read_only=True, source='created_at')

    class Meta:
        fields = ['createdBy', 'modifiedBy', 'modifiedAt', 'createdAt']
