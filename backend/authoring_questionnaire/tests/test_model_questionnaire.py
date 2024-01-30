from authoring_user.models import AuthoringUser
from authoring_core.models.organization import Organization
from authoring_core.models.organization import OrganizationMembership
from authoring_course.models import Course, Chapter
from authoring_questionnaire.models import Questionnaire

from django.db import IntegrityError
from django.test import TestCase
from datetime import datetime
from model_bakery import baker
import pytest

@pytest.mark.django_db
class QuestionnaireTestCase(TestCase):

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
        cls.chapter = baker.make(Chapter,
            created_by=cls.membership,
            course=cls.course
        )

    def test_create_questionnaire_with_course(self) -> None:
        questionnaire = baker.make(Questionnaire,
            created_by=self.membership,
            course=self.course
        )
        assert questionnaire.modified_at is not None
        assert isinstance(questionnaire.modified_at, datetime)
        assert questionnaire == Questionnaire.objects.first()
        assert questionnaire.created_by == Questionnaire.objects.first().created_by
        assert list(self.course.questionnaires.all()) == [questionnaire]
        assert list(self.membership.created_questionnaires.all()) == [questionnaire]

    def test_create_questionnaire_with_chapter(self) -> None:
        questionnaire = baker.make(Questionnaire,
            created_by=self.membership,
            chapter=self.chapter
        )
        assert questionnaire.modified_at is not None
        assert isinstance(questionnaire.modified_at, datetime)
        assert questionnaire == Questionnaire.objects.first()
        assert questionnaire.created_by == Questionnaire.objects.first().created_by
        assert self.chapter.questionnaire == questionnaire
        assert list(self.membership.created_questionnaires.all()) == [questionnaire]

    def test_create_questionnaire_without_course_or_chapter_raises_error(self) -> None:
        with pytest.raises(IntegrityError):
            baker.make(Questionnaire, course=None)
            baker.make(Questionnaire, chapter=None)
            baker.make(Questionnaire, chapter=None, course=None)
            baker.make(Questionnaire)


