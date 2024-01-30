from authoring_core.models.organization import Organization
from authoring_core.models.organization import OrganizationMembership
from authoring_questionnaire.models.questionnaire import Questionnaire
from authoring_questionnaire.serializers.questionnaire import QuestionnaireSerializer
from authoring_questionnaire.views.questionnaire import ListCreateQuestionnaire, QuestionnaireDetail
from authoring_user.models import AuthoringUser
from authoring_course.models import Course

from rest_framework.test import APITestCase
from django_utils.testutils import helper
from rest_framework import status
from django_utils.testutils.helper import response_to_json as j
from model_bakery import baker
import json
import pytest

@pytest.mark.django_db
class ListCreateQuestionnaireViewTestCase(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.view = ListCreateQuestionnaire
        cls.person = baker.make(AuthoringUser).person
        cls.organization = baker.make(Organization)
        cls.membership = baker.make(OrganizationMembership,
            person=cls.person,
            organization=cls.organization,
            role=cls.organization.get_admin_role()
        )
        cls.course = baker.make(Course,
            created_by=cls.membership,
            organization=cls.organization
        )
        cls.questionnaire = baker.make(Questionnaire,
            created_by=cls.membership,
            course=cls.course,
        )

    def test_get(self) -> None:
        response = helper.get(self.view, self.person.user, courseId=self.course.id)
        actual = j(response)

        assert response.status_code == status.HTTP_200_OK
        assert actual[0]['id'] == self.questionnaire.id
        assert actual[0]['title'] == self.questionnaire.title
        assert actual[0]['course'] == self.course.id

    def test_post(self) -> None:
        payload = json.dumps({"title": "Questionnaire", "chapter": None})
        response = helper.post(self.view, payload, self.person.user, courseId=self.course.id)
        actual = j(response)

        assert response.status_code == status.HTTP_201_CREATED
        assert actual['id'] == Questionnaire.objects.last().id
        assert actual['course'] == Questionnaire.objects.last().course.id
        assert actual['title'] == Questionnaire.objects.last().title

@pytest.mark.django_db
class QuestionnaireDetailViewTestCase(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.view = QuestionnaireDetail
        cls.serializer = QuestionnaireSerializer
        cls.person = baker.make(AuthoringUser).person
        cls.organization = baker.make(Organization)
        cls.membership = baker.make(OrganizationMembership,
            person=cls.person,
            organization=cls.organization,
            role=cls.organization.get_admin_role()
        )
        cls.course = baker.make(Course,
            created_by=cls.membership,
            organization=cls.organization
        )
        cls.questionnaire = baker.make(Questionnaire,
            created_by=cls.membership,
            course=cls.course,
        )

    def test_get_questionnaire(self) -> None:
        response = helper.get(self.view, self.person.user, questionnaireId=self.questionnaire.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        actual = j(response)

        assert actual['id'] == self.questionnaire.id == Questionnaire.objects.last().id
        assert actual['title'] == self.questionnaire.title == Questionnaire.objects.last().title

    def test_get_non_existing_questionnaire(self) -> None:
        response = helper.get(self.view, self.person.user, questionnaireId=helper.get_non_existing_pk())

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_update_questionnaire(self) -> None:
        payload = self.serializer(instance=self.questionnaire).data
        payload['title'] = 'new title'
        payload = json.dumps(payload)

        response = helper.put(self.view, payload, self.person.user, questionnaireId=self.questionnaire.id)
        assert response.status_code == status.HTTP_200_OK

        actual = j(response)
        self.questionnaire.refresh_from_db()
        expected = self.serializer(instance=self.questionnaire).data

        assert actual == expected

    def test_delete_questionnaire(self) -> None:
        response = helper.delete(self.view, self.person.user, questionnaireId=self.questionnaire.id)

        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_delete_non_existing_questionnaire(self) -> None:
        response = helper.delete(self.view, self.person.user, questionnaireId=helper.get_non_existing_pk())

        assert response.status_code == status.HTTP_404_NOT_FOUND
