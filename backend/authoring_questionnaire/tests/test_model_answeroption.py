from smartstudy_assets.models import Asset
from authoring_user.models import AuthoringUser
from authoring_core.models.organization import Organization, OrganizationMembership
from authoring_questionnaire.models import ChoiceQuestion, Questionnaire, AnswerOption
from authoring_course.models import Course

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.db import IntegrityError
from datetime import datetime
import pytest
from model_bakery import baker

@pytest.mark.django_db
class AnswerOptionModelTestCase(TestCase):

    @classmethod
    def setUpTestData(cls) -> None:
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
        cls.question = baker.make(ChoiceQuestion,
            created_by=cls.membership,
            questionnaire=cls.questionnaire,
        )
        cls.small_gif = (
            b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x00\x00\x00\x21\xf9\x04'
            b'\x01\x0a\x00\x01\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02'
            b'\x02\x4c\x01\x00\x3b'
        )
        cls.file = SimpleUploadedFile('test.gif', cls.small_gif)
        cls.asset = baker.make(Asset,file=cls.file)

    def test_answer_option_create_without_asset(self)-> None:
        answer_option = baker.make(AnswerOption,
            created_by=self.membership,
            question=self.question,
            asset=None
        )

        assert answer_option.modified_at is not None
        assert isinstance(answer_option.modified_at, datetime)
        assert answer_option == AnswerOption.objects.first()
        assert answer_option.asset is None
        assert answer_option.created_at == AnswerOption.objects.first().created_at

    def test_answer_option_create_with_asset(self)-> None:
        answer_option = baker.make(AnswerOption,
            created_by=self.membership,
            question=self.question,
            asset=self.asset
        )

        assert answer_option == AnswerOption.objects.first()
        assert answer_option.asset == AnswerOption.objects.first().asset

        


        
