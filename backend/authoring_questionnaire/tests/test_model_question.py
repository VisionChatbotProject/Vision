from authoring_questionnaire.models import questionnaire
from authoring_questionnaire.models.questionnaire import Questionnaire
from authoring_user.models import AuthoringUser
from authoring_core.models.organization import Organization
from authoring_core.models.organization import OrganizationMembership
from authoring_course.models import Course
from authoring_questionnaire.models import Question

from datetime import datetime
from django.test import TestCase
from model_bakery import baker
import pytest

@pytest.mark.django_db
class QuestionTestCase(TestCase):

    @classmethod
    def setUpTestData(cls):
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
            course=cls.course            
        )

    def test_create_question(self) -> None:
        new_question = baker.make(Question, created_by=self.membership, questionnaire=self.questionnaire)
        question = Question.objects.last()

        assert new_question.modified_at is not None
        assert isinstance(new_question.modified_at, datetime)
        assert new_question.created_by == question.created_by
        assert new_question.title == question.title
        assert new_question.id == question.id
        assert new_question.questionnaire == question.questionnaire
