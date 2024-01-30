from django.test import TestCase

from authoring_user.models import AuthoringUser
from authoring_core.models.organization import Organization
from authoring_core.models.organization import OrganizationMembership
from authoring_course.models import Course
from django.core.files.uploadedfile import SimpleUploadedFile

from smartstudy_assets.models import Asset
from model_bakery import baker
import pytest


class CourseTestCase(TestCase):
    
    @classmethod
    def setUpTestData(cls):
        cls.person = baker.make(AuthoringUser).person 
        cls.organization = baker.make(Organization)
        cls.organization_2 = baker.make(Organization)
        cls.member = baker.make(OrganizationMembership,
            person = cls.person,
            organization = cls.organization,
            role=cls.organization.get_admin_role()
        )
        cls.member_2 = baker.make(OrganizationMembership,
            person = cls.person,
            organization = cls.organization_2,
            role=cls.organization_2.get_admin_role()
        )
        
        cls.image = (
            b'\x89\x50\x4E\x47\x0D\x0A\x1A\x0A\x00\x00\x00\x0D\x49\x48\x44\x52'
            b'\x00\x00\x01\x00\x00\x00\x01\x00\x01\x03\x00\x00\x00\x66\xBC\x3A'
            b'\x25\x00\x00\x00\x03\x50\x4C\x54\x45\xB5\xD0\xD0\x63\x04\x16\xEA'
            b'\x00\x00\x00\x1F\x49\x44\x41\x54\x68\x81\xED\xC1\x01\x0D\x00\x00'
            b'\x00\xC2\xA0\xF7\x4F\x6D\x0E\x37\xA0\x00\x00\x00\x00\x00\x00\x00'
            b'\x00\xBE\x0D\x21\x00\x00\x01\x9A\x60\xE1\xD5\x00\x00\x00\x00\x49'
            b'\x45\x4E\x44\xAE\x42\x60\x82'
        )

    def test_create(self) -> None:
        course_name = 'Test Course 1'

        new_course = baker.make(Course, name=course_name, organization=self.organization)

        assert Course.objects.count() == 1

        course = Course.objects.first()

        assert course.name == course_name
        assert course == new_course
        assert course.short_description == new_course.short_description
        assert course.long_description == new_course.long_description
        assert course.organization == self.organization
        assert course.created_at is not None
        assert course.modified_at is not None
        assert course.teacher_name == new_course.teacher_name

    def test_create_with_short_description(self) -> None:
        course_name = 'Test Course 1'
        short_description = 'A Sample description'

        baker.make(Course,name=course_name, 
            short_description=short_description, 
            organization=self.organization
        )

        assert Course.objects.count() == 1

        course = Course.objects.first()
        assert course.short_description == short_description

    def test_create_with_long_description(self) -> None:
        course_name = 'Test Course 1'
        long_description = 'A Long description'

        baker.make(Course, name=course_name, 
            long_description=long_description, 
            organization=self.organization
        )

        assert Course.objects.count() == 1

        course = Course.objects.first()
        assert course.long_description == long_description

    def test_create_with_created_by(self) -> None:
        course_name = 'Test Course 1'
        baker.make(Course, name=course_name, created_by=self.member, 
            organization=self.organization
        )

        assert Course.objects.count() == 1

        course = Course.objects.first()
        assert course.created_by == self.member
        
    def test_create_courses_for_multiple_organizations(self) -> None:
        course_name = 'Test Course For Organization 1'
        course_name_2 = 'Test Course For Organization 2'
        
        baker.make(Course, name=course_name, 
            created_by=self.member, 
            organization=self.organization
        )
        baker.make(Course, name=course_name_2, 
            created_by=self.member, 
            organization=self.organization_2
        )

        assert Course.objects.count() == 2
        assert self.organization.courses.all().count() == 1
        assert self.organization_2.courses.all().count() == 1
        assert self.organization.courses.first().name == course_name
        assert self.organization_2.courses.first().name == course_name_2

    def test_create_with_image(self) -> None:
        image = Asset.objects.create(file=SimpleUploadedFile('course_image.png', self.image))
        course_name = 'Test Course With Image'

        baker.make(Course, name=course_name, 
            organization=self.organization,
            image=image
        )

        assert Course.objects.count() == 1
        assert Course.objects.first().name == course_name
        assert Course.objects.first().image == image
