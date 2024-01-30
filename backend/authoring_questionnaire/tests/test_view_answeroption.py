from authoring_questionnaire.views import ListCreateAnswerOption, AnswerOptionDetail
from authoring_questionnaire.models import Questionnaire, ChoiceQuestion, AnswerOption
from authoring_course.models import Course
from authoring_core.models.organization import Organization, OrganizationMembership
from authoring_user.models import AuthoringUser
from authoring_questionnaire.serializers import AnswerOptionPolymorphicSerializer

from django_utils.testutils import helper
from django_utils.testutils.helper import response_to_json as j
from rest_framework.test import APITestCase
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
import json
import pytest
from model_bakery import baker

@pytest.mark.django_db
class ListCreateAnswerOptionViewTestCase(APITestCase):

    @classmethod
    def setUpTestData(cls) -> None:
        cls.view = ListCreateAnswerOption
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
        cls.question = baker.make(ChoiceQuestion,
            questionnaire=cls.questionnaire,
            created_by=cls.membership, 
        )
        cls.answer_option = baker.make(AnswerOption,
            created_by=cls.membership, 
            question=cls.question,
            text='Some text' 
        )

    def test_get_answer_option(self) -> None:
        response = helper.get(self.view, self.person.user, questionId=self.question.id)
        actual = j(response)
        
        assert response.status_code == status.HTTP_200_OK
        assert actual[0]['id'] == self.answer_option.id 
        assert actual[0]['question'] == self.question.id

    def test_post_answer_option(self) -> None:
        payload = AnswerOptionPolymorphicSerializer(instance=self.answer_option).data
        payload = json.dumps(payload)
        response = helper.post(self.view, payload, self.person.user, questionId=self.question.id)
        actual = j(response)

        assert response.status_code == status.HTTP_201_CREATED
        assert actual['id'] == AnswerOption.objects.last().id
        assert actual['question'] == AnswerOption.objects.last().question.id

    def test_post_answer_option_no_user_forbidden(self) -> None:
        payload = AnswerOptionPolymorphicSerializer(instance=self.answer_option).data
        payload = json.dumps(payload)
        response = helper.post(self.view, payload, questionId=self.question.id)

        assert response.status_code == status.HTTP_403_FORBIDDEN

@pytest.mark.django_db
class AnswerOptionDetailViewTestCase(APITestCase):
    
    @classmethod
    def setUpTestData(cls):
        cls.view = AnswerOptionDetail
        cls.serializer = AnswerOptionPolymorphicSerializer
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
        cls.question = baker.make(ChoiceQuestion,
            questionnaire=cls.questionnaire,
            created_by=cls.membership, 
        )
        cls.answer_option = baker.make(AnswerOption,created_by=cls.membership, question=cls.question)
          
    def test_get_answer_option(self) -> None:
        response = helper.get(self.view, self.person.user, answerOptionId=self.answer_option.id)
        actual = j(response)

        assert response.status_code == status.HTTP_200_OK
        assert actual['id'] == self.answer_option.id
        assert actual['question'] == self.question.id
        
    def test_get_non_existing_answer_option(self) -> None:
        response = helper.get(self.view, self.person.user, answerOptionId=helper.get_non_existing_pk())
        assert response.status_code == status.HTTP_404_NOT_FOUND
                
    def test_delete_answer_option(self) -> None:
        response = helper.delete(self.view, self.person.user, answerOptionId=self.answer_option.id)
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
    def test_delete_non_existing_answer_option(self) -> None:
        response = helper.delete(self.view, self.person.user, answerOptionId=helper.get_non_existing_pk())
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_no_user_forbidden(self) -> None:
        response = helper.delete(self.view, answerOptionId=self.answer_option.id)
        assert response.status_code == status.HTTP_403_FORBIDDEN
        