from django.test import TestCase
from authoring_user.serializers import InviteMembershipSerializer
from authoring_user.models import AuthoringInvite
from authoring_user.models import AuthoringPerson
from authoring_core.models.organization import Organization


class InviteMembershipSerializerTestCase(TestCase):
    
    @classmethod
    def setUpTestData(cls):
        cls.serializer = InviteMembershipSerializer
        
        cls.organization = Organization.objects.create(name='test organization')
        
        cls.context = { 'orgId' : cls.organization.id }
        
    def test_create(self):
        email = 'john@doe.com'
        first_name = 'John'
        last_name = 'Doe'
        
        payload = {
            'email' : email,
            'firstName' : 'John',
            'lastName' : 'Doe',
            'role' : self.organization.get_admin_role().id
        }
        
        number_of_invites = AuthoringInvite.objects.all().count()
        number_of_persons = AuthoringPerson.objects.all().count()
        
        serializer = self.serializer(data=payload, context=self.context)
        self.assertTrue(serializer.is_valid())
        
        serializer.save()
        
        self.assertEqual(AuthoringInvite.objects.all().count(), number_of_invites + 1)
        self.assertEqual(AuthoringPerson.objects.all().count(), number_of_persons + 1)
        
        invite = AuthoringInvite.objects.get(email=email)
        person = invite.person
        
        self.assertEqual(invite.email, email)
        self.assertEqual(person.first_name, first_name)
        self.assertEqual(person.last_name, last_name)
