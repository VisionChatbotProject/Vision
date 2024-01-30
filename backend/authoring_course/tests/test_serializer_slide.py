from django.urls import reverse
from django.test.testcases import TestCase
from django.test.client import RequestFactory
from django.core.files.uploadedfile import SimpleUploadedFile

from rest_framework import serializers

from smartstudy_assets.models import Asset

from authoring_course.serializers import SlideSerializer
from authoring_user.models import AuthoringUser
from authoring_core.models.organization import Organization
from authoring_core.models.organization import OrganizationMembership
from authoring_course.models import Course
from authoring_course.models import Chapter
from authoring_course.models import Slide

from model_bakery import baker
import pytest

class SlideSerializerTestCase(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.serializer = SlideSerializer
        cls.person = baker.make(AuthoringUser).person
        cls.organization = baker.make(Organization)
        cls.membership = baker.make(OrganizationMembership,
            person = cls.person,
            organization = cls.organization,
            role=cls.organization.get_admin_role()
        )
        cls.course = baker.make(Course, name='Test Course 1',
            organization=cls.organization,
        )
        cls.chapter = baker.make(Chapter, title='Test Chapter 1',
            course=cls.course
        )
        cls.sample_content = b'<html><body>Slide Test Content</body></html>'
        cls.content = baker.make(Asset, file=SimpleUploadedFile(name='slide_content.html', content=cls.sample_content))
        cls.slide = baker.make(Slide, title='Slide Title 1',
            created_by=cls.membership,
            chapter=cls.chapter,
            content=cls.content
        )
        cls.request =  RequestFactory().get('', data={})

    def test_serialize(self) -> None:
        expected = {
            'id': self.slide.id,
            'title': self.slide.title,
            'createdBy': self.membership.id,
            'content': self.request.build_absolute_uri(reverse('serve_slide_asset', kwargs={ 'slideId' : self.slide.id })),
            'createdAt': serializers.DateTimeField().to_representation(self.slide.created_at),
            'modifiedAt': serializers.DateTimeField().to_representation(self.slide.modified_at),
            'order': self.slide.order
        }

        actual = self.serializer(self.slide, context={ 'request' : self.request }).data
        assert actual == expected

    def test_create(self) -> None:
        new_slide_title = 'A New Slide Title 1'
        data = {
            'title': new_slide_title,
            'content': SimpleUploadedFile(name='slide_content.html', content=self.sample_content)
        }

        serializer = self.serializer(data=data)
        assert serializer.is_valid()

        number_of_slides = Slide.objects.all().count()

        instance = serializer.save(created_by=self.membership, chapter=self.chapter)

        assert Slide.objects.all().count() == number_of_slides + 1
        assert instance.title == new_slide_title
        assert instance.created_by == self.membership
        assert instance.content.read() == self.sample_content

    def test_update(self) -> None:
        new_sample_content = b'<html><body>New Slide Test Content</body></html>'
        new_content = SimpleUploadedFile(name='new_slide_content.html', content=new_sample_content)

        new_slide_title = 'New Slide Title 2'

        data = self.serializer(instance=self.slide).data
        data['title'] = new_slide_title
        data['content'] = new_content

        serializer = self.serializer(data=data, instance=self.slide)
        assert serializer.is_valid()

        instance = serializer.save()

        assert instance.title == new_slide_title
        assert instance.content.read() == new_sample_content
