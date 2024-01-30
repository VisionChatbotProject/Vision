from authoring_questionnaire.views import ListCreateQuestion, ListCreateQuestionnaire
from authoring_core.models.organization import Organization
from authoring_core.models.organization import OrganizationMembership
from authoring_user.models import AuthoringUser
from authoring_course.models import Course
from authoring_questionnaire.models import ChoiceQuestion, Questionnaire

from rest_framework.test import APITestCase
from rest_framework import status
from django_utils.testutils import helper
from django_utils.testutils.helper import response_to_json as j
from django.core.files.uploadedfile import SimpleUploadedFile

from model_bakery import baker
import pytest

@pytest.mark.django_db
class ListCreateQuestionViewTestCase(APITestCase):
    
    @classmethod
    def setUpTestData(cls):
        cls.view = ListCreateQuestion
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
        cls.question_title = 'Question 1'
        cls.text = 'Question 1 Description'
        cls.question = baker.make(ChoiceQuestion,
            title=cls.question_title, 
            text=cls.text, 
            questionnaire=cls.questionnaire,
            created_by=cls.membership
        )
        cls.question_payload_title = 'Question 2'
        cls.text = 'Question 2 Description'
        cls.question_payload = {
            'title': cls.question_payload_title,
            'text': cls.text,
            'resourcetype': 'ChoiceQuestion'
        }
        
    def test_get_question(self) -> None:
        response = helper.get(self.view, self.person.user, questionnaireId=self.questionnaire.id)
        actual = j(response)

        assert response.status_code == status.HTTP_200_OK
        assert actual[0]['id'] == self.question.id
        assert actual[0]['questionnaire'] == self.questionnaire.id
        assert actual[0]['title'] == self.question_title
        
    def test_post_question(self) -> None:
        response = helper.post(self.view, self.question_payload, self.person.user, questionnaireId=self.questionnaire.id, send_multipart=True)
        actual = j(response)
        question = ChoiceQuestion.objects.get(title=self.question_payload_title)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert actual['id'] == question.id
        assert actual['title'] == question.title
        assert actual['text'] == question.text
        assert actual['questionnaire'] == question.questionnaire.id

    def test_post_invalid_data_returns_400(self) -> None:
        invalid_payload = {
            'title': '',
            'text': '',
        }
        response = helper.post(self.view, invalid_payload, self.person.user, questionnaireId=self.questionnaire.id, send_multipart=True)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
