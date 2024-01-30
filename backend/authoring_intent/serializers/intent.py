from rest_framework import serializers
from authoring_intent.models import AbstractIntent

    
class IntentSerializer(serializers.ModelSerializer):
    name = serializers.CharField()
    intents = serializers.JSONField()
    response = serializers.CharField()
    isQuestion = serializers.BooleanField(source='is_question')

    class Meta:
        model = AbstractIntent
        fields = ['id', 'name', 'intents', 'response', 'isQuestion']