from django.shortcuts import get_object_or_404
from smartstudy_auth.views import ListCreateInvite
from authoring_core.models.organization import Organization, OrganizationMembership, OrganizationRole
from authoring_user.serializers.invite_membership import InviteMembershipSerializer
from smartstudy_auth.serializers import InviteSerializer
from rest_framework.permissions import SAFE_METHODS
from rest_framework.permissions import IsAuthenticated


class CreateInviteOrganizationMembership(ListCreateInvite):
    lookup_url_kwarg = 'orgId'

    def get_queryset(self):
        orgId = self.kwargs[self.lookup_url_kwarg]
        organization = get_object_or_404(Organization.objects, id=orgId)
        return super().get_queryset().filter(person__organization_memberships__organization__in=[organization], used=False)

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            self.permission_classes = [IsAuthenticated]
        elif self.request.method == 'POST':
            self.permission_classes = [IsAuthenticated]

        return super().get_permissions()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return InviteSerializer
        else:
            return InviteMembershipSerializer

    def perform_create(self, serializer):
        invite = serializer.save()
        orgId = self.kwargs[self.lookup_url_kwarg]
        organization = get_object_or_404(Organization.objects, id=orgId)
        role = get_object_or_404(OrganizationRole.objects, organization=organization, id=self.request.data['role'])

        OrganizationMembership.objects.create(organization=organization, person=invite.person, role=role)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['orgId'] = self.kwargs[self.lookup_url_kwarg]
        return context
