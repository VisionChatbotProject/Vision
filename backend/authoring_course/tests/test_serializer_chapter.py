from django.test.testcases import TestCase
from rest_framework import serializers
from authoring_course.models.chapter import Chapter
from authoring_course.serializers import ChapterSerializer
from authoring_user.models import AuthoringUser
from authoring_core.models.organization import Organization
from authoring_core.models.organization import OrganizationMembership
from authoring_course.models import Course

from model_bakery import baker
import pytest


class ChapterSerializerTestCase(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.serializer = ChapterSerializer
        cls.person = baker.make(AuthoringUser).person
        cls.organization = baker.make(Organization)
        cls.membership = baker.make(
            OrganizationMembership,
            person=cls.person,
            organization=cls.organization,
            role=cls.organization.get_admin_role()
        )
        cls.course = baker.make(
            Course, name='Test Course',
            organization=cls.organization,
        )
        cls.chapter = baker.make(
            Chapter, title='Test Chapter',
            short_description='short chapter description',
            long_description='long chapter description',
            course=cls.course
        )
        cls.context = {'courseId': cls.course.id}

    def test_serialize(self) -> None:
        expected = {
            'id': self.chapter.id,
            'title': 'Test Chapter',
            'shortDescription': 'short chapter description',
            'longDescription': 'long chapter description',
            'course': self.course.id,
            'parent': None,
            'createdBy': None,
            'createdAt': serializers.DateTimeField().to_representation(self.chapter.created_at),
            'modifiedAt': serializers.DateTimeField().to_representation(self.chapter.modified_at),
            'order': self.chapter.order
        }

        actual = self.serializer(self.chapter).data
        assert actual == expected

    def test_create(self) -> None:
        new_chapter_title = 'A New Test Chapter'
        new_chapter_short_description = 'new chapter short description'
        new_chapter_long_description = 'new chapter long description'

        data = {
            'title': new_chapter_title,
            'shortDescription': new_chapter_short_description,
            'longDescription': new_chapter_long_description
        }

        serializer = self.serializer(data=data, context=self.context)
        assert serializer.is_valid()

        number_of_chapters = Chapter.objects.all().count()

        instance = serializer.save(course=self.course, created_by=self.membership)

        assert Chapter.objects.all().count() == number_of_chapters + 1
        assert instance.title == new_chapter_title
        assert instance.course == self.course

    def test_update(self) -> None:
        new_modified_chapter_title = 'Modified Test Chapter'
        new_modified_chapter_short_description = 'modified short chapter description'
        new_modified_chapter_long_description = 'modified long chapter description'

        data = self.serializer(instance=self.chapter).data
        data['title'] = new_modified_chapter_title
        data['shortDescription'] = new_modified_chapter_short_description
        data['longDescription'] = new_modified_chapter_long_description

        serializer = self.serializer(data=data, instance=self.chapter, context=self.context)
        assert serializer.is_valid()

        instance = serializer.save(created_by=self.membership)

        assert instance.title == new_modified_chapter_title
