import json
from rest_framework.test import APITestCase
from authoring_user.views import CreateInviteOrganizationMembership
from authoring_core.models.organization import Organization
from authoring_core.models.organization import OrganizationMembership
from django_utils.testutils import helper
from rest_framework import status
from authoring_user.models import AuthoringInvite
from authoring_user.models import AuthoringPerson
from authoring_user.models import AuthoringUser
from smartstudy_auth.serializers import InviteSerializer
from django_utils.testutils.helper import response_to_json as j


class ListCreateInviteTestCase(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.view = CreateInviteOrganizationMembership

        cls.person = AuthoringUser.objects.create(username='1', email='user1@test.com', password='123').person

        cls.organization = Organization.objects.create(name='test organization')

        cls.person_virtual = AuthoringPerson.objects.create(first_name='user', last_name='virtual')
        OrganizationMembership.objects.create(
            organization=cls.organization,
            person=cls.person_virtual,
            role=cls.organization.roles.all().first()
        )

        cls.invite = AuthoringInvite.objects.create(email='user-virtual@test.com', person=cls.person_virtual)

        cls.email = 'john-doe@test.com'
        cls.first_name = 'John'
        cls.last_name = 'Doe'

        cls.payload = json.dumps({
            'email': cls.email,
            'firstName': cls.first_name,
            'lastName': cls.last_name,
            'role': cls.organization.get_admin_role().id
        })

    def test_permissions_get(self):
        # an unregistered user cannot access invites
        self.assertFalse(helper.is_get_allowed(self.view, None, orgId=self.organization.id))

        # a registered user can access invites
        self.assertTrue(helper.is_get_allowed(self.view, self.person.user, orgId=self.organization.id))

    def test_permissions_post(self):
        # an unregistered user cannot create new invites
        self.assertFalse(helper.is_post_allowed(self.view, self.payload, None, orgId=self.organization.id))

        # a registered user can create new invites
        self.assertTrue(helper.is_post_allowed(self.view, self.payload, self.person.user, orgId=self.organization.id))

    def test_get(self) -> None:
        expected = InviteSerializer(instance=self.invite).data
        response = helper.get(self.view, self.person.user, orgId=self.organization.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = j(response)[0]

        expected_person = expected['person']
        response_person = response['person']
        self.assertEqual(expected_person, response_person)

        del expected['person']
        del response['person']

        self.assertEqual(expected, response)

    def test_post(self) -> None:
        number_of_invites = AuthoringInvite.objects.all().count()
        number_of_persons = AuthoringPerson.objects.all().count()

        response = helper.post(self.view, self.payload, self.person.user, orgId=self.organization.id)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(AuthoringInvite.objects.all().count(), number_of_invites + 1)
        self.assertEqual(AuthoringPerson.objects.all().count(), number_of_persons + 1)

        invite = AuthoringInvite.objects.get(email=self.email)
        person = invite.person

        self.assertIsNotNone(invite.code)
        self.assertEqual(person.first_name, self.first_name)
        self.assertEqual(person.last_name, self.last_name)
