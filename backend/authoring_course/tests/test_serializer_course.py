from django.test.testcases import TestCase
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test.client import RequestFactory

from rest_framework import serializers

from smartstudy_assets.models import Asset

from authoring_user.models import AuthoringUser
from authoring_core.models.organization import Organization
from authoring_core.models.organization import OrganizationMembership
from authoring_course.models import Course, course
from authoring_course.serializers import CourseSerializer

from model_bakery import baker
import pytest


class CourseSerializerTestCase(TestCase):
    
    @classmethod
    def setUpTestData(cls):
        cls.image = (
            b'\x89\x50\x4E\x47\x0D\x0A\x1A\x0A\x00\x00\x00\x0D\x49\x48\x44\x52'
            b'\x00\x00\x01\x00\x00\x00\x01\x00\x01\x03\x00\x00\x00\x66\xBC\x3A'
            b'\x25\x00\x00\x00\x03\x50\x4C\x54\x45\xB5\xD0\xD0\x63\x04\x16\xEA'
            b'\x00\x00\x00\x1F\x49\x44\x41\x54\x68\x81\xED\xC1\x01\x0D\x00\x00'
            b'\x00\xC2\xA0\xF7\x4F\x6D\x0E\x37\xA0\x00\x00\x00\x00\x00\x00\x00'
            b'\x00\xBE\x0D\x21\x00\x00\x01\x9A\x60\xE1\xD5\x00\x00\x00\x00\x49'
            b'\x45\x4E\x44\xAE\x42\x60\x82'
        )
        cls.course_image = Asset.objects.create(file=SimpleUploadedFile('course_image.png', cls.image))
        
        cls.serializer = CourseSerializer
        cls.request =  RequestFactory().get('', data={})

        cls.person = baker.make(AuthoringUser).person 
        cls.organization = baker.make(Organization)
        cls.member = baker.make(OrganizationMembership,
            person = cls.person,
            organization = cls.organization,
            role=cls.organization.get_admin_role()
        )
        cls.course = baker.make(Course, name='Test Course',
            short_description = 'it is a test', 
            long_description = 'it is still just a test', 
            organization=cls.organization,
            image=cls.course_image)

        
    def test_serialize(self) -> None:
        actual = self.serializer(instance=self.course, context={ 'request' : self.request }).data
        expected = {
            'id': self.course.id,
            'name': 'Test Course',
            'shortDescription': 'it is a test',
            'longDescription': 'it is still just a test',
            'image': self.request.build_absolute_uri(reverse('serve_course_image', kwargs={ 'courseId' : self.course.id, 'assetPk' : self.course.image.pk })),
            'organization': self.organization.id,
            'createdBy': None,
            'createdAt': serializers.DateTimeField().to_representation(self.course.created_at),
            'modifiedAt': serializers.DateTimeField().to_representation(self.course.modified_at),
            'courseBeginDate': None,
            'courseEndDate': None,
            'materials': self.course.materials,
            'ressources': self.course.ressources,
            'teacherName': self.course.teacher_name,
            'teacherEmail': self.course.teacher_email,
        }
        
        assert actual == expected
        
    def test_create(self) -> None:
        new_course_name = 'New Test Course'
        new_course_short_description = 'New Test Course Short Description'
        new_course_long_description = 'New Test Course Long Description'
        
        data = {
            'name': new_course_name,
            'shortDescription': new_course_short_description,
            'longDescription': new_course_long_description
        }
        
        serializer = self.serializer(data=data)
        assert serializer.is_valid() == True
        
        number_of_courses = Course.objects.all().count()
        
        instance = serializer.save(created_by=self.member, organization=self.organization)
        
        assert Course.objects.all().count() == number_of_courses + 1
        assert instance.name == new_course_name
        assert instance.short_description == new_course_short_description
        
    def test_update(self) -> None:
        new_modified_course_name = 'Modified Course Name'
        new_modified_course_short_description = 'Modified Short Description'
        new_modified_course_long_description = 'Modified Long Description'
        
        data = {
            'name': new_modified_course_name,
            'shortDescription': new_modified_course_short_description,
            'longDescription': new_modified_course_long_description,
            'image': SimpleUploadedFile('modified_course_image.png', self.image)
        }
        
        serializer = self.serializer(instance=self.course, data=data)
        assert serializer.is_valid() == True
        
        instance = serializer.save(created_by=self.member, organization=self.organization)
        
        assert 'modified_course_image' in instance.image.file.name
        assert instance.name == new_modified_course_name
        assert instance.created_by == self.member
        assert instance.organization == self.organization
