from smartstudy_auth.serializers import CreateInviteSerializer
from smartstudy_org_core.serializers import OrganizationRoleField

from smartstudy_auth.models import get_invite_model


class InviteMembershipSerializer(CreateInviteSerializer):

    role = OrganizationRoleField(write_only=True)

    class Meta:
        model = get_invite_model()
        fields = ['email', 'firstName', 'lastName', 'role']

    def create(self, validated_data):
        validated_data.pop('role')
        return super().create(validated_data)
