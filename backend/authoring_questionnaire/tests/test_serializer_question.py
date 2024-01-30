from smartstudy_assets.models import Asset
from authoring_questionnaire.models import Question, Questionnaire
from authoring_questionnaire.serializers.question import QuestionSerializer
from authoring_user.models import AuthoringUser
from authoring_core.serializers import AuditableSerializer
from authoring_core.models.organization import Organization
from authoring_core.models.organization import OrganizationMembership
from authoring_course.models import Course

from django.urls import reverse
from django.test.testcases import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test.client import RequestFactory
from rest_framework import serializers
from model_bakery import baker
import pytest


@pytest.mark.django_db
class QuestionSerializerTestCase(TestCase):
    
    @classmethod
    def setUpTestData(cls):
        cls.image_data = (
            b'\x89\x50\x4E\x47\x0D\x0A\x1A\x0A\x00\x00\x00\x0D\x49\x48\x44\x52'
            b'\x00\x00\x01\x00\x00\x00\x01\x00\x01\x03\x00\x00\x00\x66\xBC\x3A'
            b'\x25\x00\x00\x00\x03\x50\x4C\x54\x45\xB5\xD0\xD0\x63\x04\x16\xEA'
            b'\x00\x00\x00\x1F\x49\x44\x41\x54\x68\x81\xED\xC1\x01\x0D\x00\x00'
            b'\x00\xC2\xA0\xF7\x4F\x6D\x0E\x37\xA0\x00\x00\x00\x00\x00\x00\x00'
            b'\x00\xBE\x0D\x21\x00\x00\x01\x9A\x60\xE1\xD5\x00\x00\x00\x00\x49'
            b'\x45\x4E\x44\xAE\x42\x60\x82'
        )
        cls.image_file = SimpleUploadedFile('question_asset.png', cls.image_data)
        cls.question_asset = baker.make(Asset,file=cls.image_file)
        cls.person = baker.make(AuthoringUser).person 
        cls.organization = baker.make(Organization)
        cls.membership = baker.make(OrganizationMembership,
            person=cls.person, 
            organization=cls.organization, 
            role=cls.organization.get_admin_role()
        )
        cls.course = baker.make(Course, organization=cls.organization)
        cls.questionnaire = baker.make(Questionnaire, created_by=cls.membership, course=cls.course)
        cls.question = baker.make(Question,
            title='Example Question', 
            text='A short description of the question', 
            questionnaire=cls.questionnaire,
            created_by=cls.membership, 
            asset=cls.question_asset
        )
        cls.serializer = QuestionSerializer
        cls.request =  RequestFactory().get('', data={})
        
    def test_serialize(self) -> None:
        actual = self.serializer(instance=self.question, context={ 'request' : self.request }).data
        
        expected = {
            'id': self.question.id,
            'questionnaire': self.questionnaire.id,
            **AuditableSerializer(instance=self.question).data,
            'title': self.question.title,
            'text': self.question.text,
            'asset': self.request.build_absolute_uri(reverse('serve_question_image', kwargs={ 'questionId' : self.question.id, 'assetPk' : self.question.asset.pk }))
        }
        assert actual == expected
        
    def test_create(self) -> None:
        new_question_title = 'Another New Question'
        new_question_text = 'A short description of the new question'
        new_question_order_index = 1
        data = {
            'title': new_question_title,
            'text': new_question_text,
            'orderIndex': new_question_order_index
        }
        serializer = self.serializer(data=data)

        assert serializer.is_valid()
        
        number_of_questions = Question.objects.count()
        instance = serializer.save(created_by=self.membership, questionnaire=self.questionnaire)
        
        assert isinstance(instance, Question) 
        assert Question.objects.count() == number_of_questions+1
        assert instance.title == new_question_title
        assert instance.text == new_question_text
        assert instance.created_by == self.membership
        
    def test_update(self) -> None:
        new_image_data = (
            b'\x47\x47\x47\x47\x47\x47\x47\x47\x47\x47\x47\x47\x47\x47\x47\x47'
            b'\x00\x00\x01\x00\x00\x00\x01\x00\x01\x03\x00\x00\x00\x66\xBC\x3A'
            b'\x25\x00\x00\x00\x03\x50\x4C\x54\x45\xB5\xD0\xD0\x63\x04\x16\xEA'
            b'\x00\x00\x00\x1F\x49\x44\x41\x54\x68\x81\xED\xC1\x01\x0D\x00\x00'
            b'\x00\xC2\xA0\xF7\x4F\x6D\x0E\x37\xA0\x00\x00\x00\x00\x00\x00\x00'
            b'\x00\xBE\x0D\x21\x00\x00\x01\x9A\x60\xE1\xD5\x00\x00\x00\x00\x49'
            b'\x45\x4E\x44\xAE\x42\x60\x82'
        )
        new_asset = Asset.objects.create(file=SimpleUploadedFile('new_question_asset.png', content=new_image_data))
        new_question_title = 'Updated Question Title'
        data = self.serializer(instance=self.question).data
        data['title'] = new_question_title
        data['asset'] = new_asset.file.name
        serializer = self.serializer(data=data, instance=self.question)

        assert serializer.is_valid()
        
        instance = serializer.save()
        instance_file_data = instance.asset.file.read()
        
        assert instance.title == new_question_title
        assert instance.asset.file.name == new_asset.file.name
        assert instance_file_data == new_image_data
