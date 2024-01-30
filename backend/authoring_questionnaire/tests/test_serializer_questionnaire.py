from authoring_user.models import AuthoringUser
from authoring_core.models.organization import Organization
from authoring_core.models.organization import OrganizationMembership
from authoring_course.models import Course
from authoring_questionnaire.serializers import QuestionnaireSerializer
from authoring_questionnaire.models import Questionnaire

from django.test.testcases import TestCase
from rest_framework import serializers
from model_bakery import baker
import pytest

@pytest.mark.django_db
class QuestionnaireSerializerTestCase(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.serializer = QuestionnaireSerializer
        cls.person = baker.make(AuthoringUser).person
        cls.organization = baker.make(Organization)
        cls.membership = baker.make(OrganizationMembership,
            person=cls.person,
            organization=cls.organization,
            role=cls.organization.get_admin_role()
        )
        cls.course = baker.make(Course, organization=cls.organization)
        cls.context = {'courseId': cls.course.id}
        cls.questionnaire = baker.make(Questionnaire, title='Test Qestionnaire', course=cls.course, created_by=cls.membership)

    def test_serialize(self) -> None:
        expected = {
            'id': self.questionnaire.id,
            'course': self.course.id,
            'chapter': None,
            'title': self.questionnaire.title,
            'createdBy': self.membership.id,
            'createdAt': serializers.DateTimeField().to_representation(self.questionnaire.created_at),
            'modifiedAt': serializers.DateTimeField().to_representation(self.questionnaire.modified_at)
        }
        actual = self.serializer(self.questionnaire).data
        assert actual == expected

    def test_create(self) -> None:
        new_questionnaire_title = 'A New Questionnaire'
        data = {
            'title': new_questionnaire_title,
            'chapter': None
        }
        serializer = self.serializer(data=data, context=self.context)

        assert serializer.is_valid()

        instance = serializer.save(created_by=self.membership)

        assert instance == Questionnaire.objects.last()
        assert instance.title == new_questionnaire_title
        assert instance.course == self.course

    def test_update(self) -> None:
        new_modified_questionnaire_title = 'New modified title'
        data = self.serializer(instance=self.questionnaire).data
        data['title'] = new_modified_questionnaire_title
        serializer = self.serializer(data=data, instance=self.questionnaire, context=self.context)

        assert serializer.is_valid()

        instance = serializer.save(created_by=self.membership)

        assert instance.title == new_modified_questionnaire_title