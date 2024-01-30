from authoring_user.models import AuthoringUser
from authoring_core.models.organization import Organization, OrganizationMembership
from authoring_course.models import Course
from authoring_questionnaire.models import Questionnaire, ChoiceQuestion, AnswerOption
from authoring_questionnaire.serializers import AnswerOptionSerializer, AnswerOptionPolymorphicSerializer
from smartstudy_assets.models import Asset

from rest_framework import serializers
from django.urls import reverse
from django.test.testcases import TestCase
from django.test.client import RequestFactory
from django.core.files.uploadedfile import SimpleUploadedFile
from model_bakery import baker
import pytest

@pytest.mark.django_db
class AnswerOptionSerializerTestCase(TestCase):

    @classmethod
    def setUpTestData(cls) -> None:
        cls.image_data = (
            b'\x89\x50\x4E\x47\x0D\x0A\x1A\x0A\x00\x00\x00\x0D\x49\x48\x44\x52'
            b'\x00\x00\x01\x00\x00\x00\x01\x00\x01\x03\x00\x00\x00\x66\xBC\x3A'
            b'\x25\x00\x00\x00\x03\x50\x4C\x54\x45\xB5\xD0\xD0\x63\x04\x16\xEA'
            b'\x00\x00\x00\x1F\x49\x44\x41\x54\x68\x81\xED\xC1\x01\x0D\x00\x00'
            b'\x00\xC2\xA0\xF7\x4F\x6D\x0E\x37\xA0\x00\x00\x00\x00\x00\x00\x00'
            b'\x00\xBE\x0D\x21\x00\x00\x01\x9A\x60\xE1\xD5\x00\x00\x00\x00\x49'
            b'\x45\x4E\x44\xAE\x42\x60\x82'
        )
        cls.image_file = SimpleUploadedFile('answer_option_asset.png', cls.image_data)
        cls.answer_option_asset = baker.make(Asset,file=cls.image_file)
        cls.multiple_choice_answer_option_asset = baker.make(Asset,file=cls.image_file)
        cls.text_answer_option_asset = baker.make(Asset,file=cls.image_file)
        cls.person = baker.make(AuthoringUser).person 
        cls.organization = baker.make(Organization)
        cls.membership = baker.make(OrganizationMembership,
            person=cls.person, 
            organization=cls.organization, 
            role=cls.organization.get_admin_role()
        )
        cls.course = baker.make(Course,organization=cls.organization)
        cls.questionnaire = baker.make(Questionnaire, created_by=cls.membership, course=cls.course)
        cls.question = baker.make(ChoiceQuestion,
            questionnaire=cls.questionnaire,
            created_by=cls.membership, 
            asset=None
        )
       
        cls.answer_option_description='Answer Option Description'
        cls.answer_option_text='test'
        cls.answer_option = baker.make(AnswerOption,
            created_by=cls.membership,
            question=cls.question,
            asset=cls.answer_option_asset,
            text='Some text',
            correct_answer=False,
        )

        cls.serializer = AnswerOptionPolymorphicSerializer
        cls.request =  RequestFactory().get('', data={})

    def test_serialize_answerOption(self) -> None:
        serializer = AnswerOptionSerializer 

        actual = serializer(instance=self.answer_option, context={ 'request' : self.request }).data
        expected = {
                'id': self.answer_option.id,
                'createdBy': self.membership.id,
                'createdAt': serializers.DateTimeField().to_representation(self.answer_option.created_at),
                'modifiedAt': serializers.DateTimeField().to_representation(self.answer_option.modified_at),
                'question': self.question.id,
                'text': self.answer_option.text,
                'correctAnswer': self.answer_option.correct_answer,
                'modifiedBy': None,
                'asset': self.request.build_absolute_uri(reverse('serve_answer_option_image', kwargs={ 'answerOptionId' : self.answer_option.id, 'assetPk' : self.answer_option.asset.pk })),
        }
        assert actual == expected

    def test_update_answer_option(self) -> None:
        new_image_data = (
            b'\x47\x47\x47\x47\x47\x47\x47\x47\x47\x47\x47\x47\x47\x47\x47\x47'
            b'\x00\x00\x01\x00\x00\x00\x01\x00\x01\x03\x00\x00\x00\x66\xBC\x3A'
            b'\x25\x00\x00\x00\x03\x50\x4C\x54\x45\xB5\xD0\xD0\x63\x04\x16\xEA'
            b'\x00\x00\x00\x1F\x49\x44\x41\x54\x68\x81\xED\xC1\x01\x0D\x00\x00'
            b'\x00\xC2\xA0\xF7\x4F\x6D\x0E\x37\xA0\x00\x00\x00\x00\x00\x00\x00'
            b'\x00\xBE\x0D\x21\x00\x00\x01\x9A\x60\xE1\xD5\x00\x00\x00\x00\x49'
            b'\x45\x4E\x44\xAE\x42\x60\x82'
        )
        new_answer_option_asset = baker.make(Asset,
            file=SimpleUploadedFile('new_answer_option_asset.png',
            content=new_image_data)
        )
        data = self.serializer(instance=self.answer_option).data
        data['asset'] = new_answer_option_asset.file.name
        serializer = self.serializer(data=data, instance=self.answer_option)

        assert serializer.is_valid()
        
        instance = serializer.save()
        instance_file_data = instance.asset.file.read()
        
        assert instance.asset.file.name == new_answer_option_asset.file.name
        assert instance_file_data == new_image_data

    def test_serializer_answer_option_polymorphic(self) -> None:
        serializer = AnswerOptionPolymorphicSerializer
        actual = serializer(instance=self.answer_option, context={ 'request' : self.request }).data
        expected = {
                **AnswerOptionSerializer(instance=self.answer_option, context={ 'request' : self.request }).data,
                'resourcetype': self.answer_option._meta.object_name
        }
        
        assert actual == expected



        



        





        