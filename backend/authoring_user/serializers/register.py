from rest_framework import serializers

from smartstudy_auth.serializers import EmailOnlyRegisterSerializer


class AuthoringRegisterSerializer(EmailOnlyRegisterSerializer):
    firstName = serializers.CharField()
    lastName = serializers.CharField()

    def custom_signup(self, _, user):
        first_name = self.validated_data.get('firstName')
        last_name = self.validated_data.get('lastName')
        user.person.first_name = first_name
        user.person.last_name = last_name
        user.person.save()