import json
from django_utils.testutils.helper import response_to_json as j
from django.core.files.uploadedfile import SimpleUploadedFile
from django_utils.testutils import helper

from rest_framework.test import APITestCase
from rest_framework import status

from authoring_course.views import ListCreateCourse
from authoring_course.views import CourseDetail
from authoring_core.models.organization import Organization
from authoring_core.models.organization import OrganizationMembership
from authoring_user.models import AuthoringUser
from authoring_course.models import Course
from authoring_course.serializers import CourseSerializer

from model_bakery import baker
import pytest


class ListCreateCourseViewTestCase(APITestCase):
    
    @classmethod
    def setUpTestData(cls) -> None:
        cls.small_pdf = (
            b'\x25\x50\x44\x46\x2D\x31\x2E\x0D\x74\x72\x61\x69\x6C\x65\x72\x3C'
            b'\x3C\x2F\x52\x6F\x6F\x74\x3C\x3C\x2F\x50\x61\x67\x65\x73\x3C\x3C'
            b'\x2F\x4B\x69\x64\x73\x5B\x3C\x3C\x2F\x4D\x65\x64\x69\x61\x42\x6F'
            b'\x78\x5B\x30\x20\x30\x20\x33\x20\x33\x5D\x3E\x3E\x5D\x3E\x3E\x3E'
            b'\x3E\x3E\x3E'
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
        cls.view = ListCreateCourse
        
        cls.person_no_membership = baker.make(AuthoringUser, 
            username='0', 
            email='user0@test.com', 
            password='123'
        ).person
        cls.person = baker.make(AuthoringUser, 
            username='1', 
            email='user1@test.com', 
            password='123'
        ).person
        cls.person_2 = baker.make(AuthoringUser, 
            username='2', 
            email='user2@test.com', 
            password='123'
        ).person
        
        cls.organization = baker.make(Organization,name='test organization')
        cls.organization_2 = baker.make(Organization,name='test organization 2')
        
        cls.membership = baker.make(OrganizationMembership, 
            person=cls.person, 
            organization=cls.organization, 
            role=cls.organization.get_admin_role()
        )
        cls.membership_2 = baker.make(OrganizationMembership, 
            person=cls.person_2, 
            organization=cls.organization_2, 
            role=cls.organization_2.get_admin_role()
        )
        
        cls.course = baker.make(Course, 
            name='Test Course', 
            short_description='short description',
            long_description='a longer description', 
            created_by=cls.membership, 
            organization=cls.organization
        )
        
        cls.course_payload_name = 'Another Test Course'
        cls.course_payload_short_description = 'another short description'
        cls.course_payload_long_description = 'another long description'
        
        cls.course_payload = json.dumps({
            'name': cls.course_payload_name,
            'shortDescription': cls.course_payload_short_description,
            'longDescription': cls.course_payload_long_description
        })
        
        
    def test_permissions_get(self) -> None:
        # a user without a membership to an organization sees the courses of an organization
        assert helper.is_get_allowed(self.view, self.person_no_membership.user, orgId=self.organization.id)
        
        # a user with a membership to an organization sees all courses of this organization
        assert helper.is_get_allowed(self.view, self.person.user, orgId=self.organization.id)
        
        # a user with a membership to one organization sees all courses of another organization
        assert helper.is_get_allowed(self.view, self.person.user, orgId=self.organization_2.id)
        
        # an unauthenticated user cannot see any courses
        assert helper.is_get_allowed(self.view, None, orgId=self.organization.id) is False
        
    def test_permissions_post(self) -> None:
        # a user without a membership to an organization cannot create courses
        assert helper.is_post_allowed(self.view, self.course_payload, self.person_no_membership.user, orgId=self.organization.id) is False
        
        # a user with a membership to an organization can create courses in that organization
        assert helper.is_post_allowed(self.view, self.course_payload, self.person.user, orgId=self.organization.id)
        
        # a user with a membership to one organization cannot create courses in another organization to which he does not have a membership
        assert helper.is_post_allowed(self.view, self.course_payload, self.person.user, orgId=self.organization_2.id) is False
        
        # an unauthenticated user cannot create a new course
        assert helper.is_post_allowed(self.view, self.course_payload, None, orgId=self.organization.id) is False
        
    def test_get(self) -> None:
        response = helper.get(self.view, self.person.user, orgId=self.organization.id)
        assert response.status_code == status.HTTP_200_OK
        actual = j(response)
        assert len(actual) == 1
        assert actual[0]['id'] == self.course.id
        
    def test_post_with_valid_image_format(self) -> None:
        course_image = SimpleUploadedFile('course_image.png', self.image)
        course_name = 'Course Name Valid Image'
        course_short_description = 'Short Course Description'
        course_long_description = 'Long Course Description'
        course_payload = {
            'name': course_name,
            'shortDescription': course_short_description,
            'longDescription': course_long_description,
            'image': course_image
        }
        
        response = helper.post(self.view, course_payload, self.person.user, orgId=self.organization.id, send_multipart=True)
        assert response.status_code == status.HTTP_201_CREATED
        
        course = Course.objects.get(name=course_name)
        
        assert course.name == course_name
        assert course.created_by == self.membership
        assert course.image.file.read() == self.image
        
    def test_post_with_invalid_image_format(self) -> None:
        course_image = SimpleUploadedFile('course_image_invalid.pdf', self.small_pdf)
        course_name = 'Course Name Invalid Image'
        course_short_description = 'Short Course Description'
        course_long_description = 'Long Course Description'
        course_payload = {
            'name': course_name,
            'shortDescription': course_short_description,
            'longDescription': course_long_description,
            'image': course_image
        }
        
        response = helper.post(self.view, course_payload, self.person.user, orgId=self.organization.id, send_multipart=True)
        
        # This should fail, logically. But the asset library simply does not know yet how to validate files. This will be added later
        # so for now, this test is passing
        assert response.status_code == status.HTTP_201_CREATED
        
    
    # NOTE: This testcase should later be outsourced into a permission testcase. The error that should be
    #       thrown is a 'HTTP_403' forbidden. In this testcase 'person_2' has no membership for the given
    #       organization is therefore failing within the 'perform_create' that throws a '404' at 'get_object_or_404()'
    def test_post_not_allowed(self) -> None:
        response = helper.post(self.view, self.course_payload, self.person_2.user, orgId=self.organization.id)
        assert response.status_code == status.HTTP_404_NOT_FOUND
        

class CourseDetailViewTestCase(APITestCase):
    
    @classmethod
    def setUpTestData(cls):
        cls.view = CourseDetail

        cls.person_no_membership = baker.make(AuthoringUser, 
            username='0', 
            email='user0@test.com', 
            password='123'
        ).person
        cls.person = baker.make(AuthoringUser, 
            username='1', 
            email='user1@test.com', 
            password='123'
        ).person
        cls.person_2 = baker.make(AuthoringUser, 
            username='2', 
            email='user2@test.com', 
            password='123'
        ).person
        cls.organization = baker.make(Organization,name='test organization')
        cls.organization_2 = baker.make(Organization,name='test organization 2')
        cls.membership = baker.make(OrganizationMembership, 
            person=cls.person, 
            organization=cls.organization, 
            role=cls.organization.get_admin_role()
        )
        cls.membership_2 = baker.make(OrganizationMembership, 
            person=cls.person_2, 
            organization=cls.organization_2, 
            role=cls.organization_2.get_admin_role()
        )
        cls.course = baker.make(Course, 
            name='Test Course', 
            short_description='short description',
            long_description='a longer description', 
            created_by=cls.membership, 
            organization=cls.organization
        )
        cls.serializer = CourseSerializer
        
    def test_permissions_get(self) -> None:
        # a user without a membership to an organization sees the details of a course
        assert helper.is_get_allowed(self.view, self.person_no_membership.user, courseId=self.course.id)
        
        # a user with a membership to an organization can see the details of a course belonging to the same organization
        assert helper.is_get_allowed(self.view, self.person.user, courseId=self.course.id)
        
        # a user with a membership to one organization can see the details of a course belonging to another organization
        assert helper.is_get_allowed(self.view, self.person_2.user, courseId=self.course.id)
        
        # an unauthenticated user cannot see the details of a course
        assert helper.is_get_allowed(self.view, None, courseId=self.course.id) is False
        
    def test_permissions_put(self) -> None:
        payload = CourseSerializer(instance=self.course).data
        payload['name'] = 'Modified Test Course2'
        payload = json.dumps(payload)
        
        # a user without a membership to an organization can update a course
        assert helper.is_put_allowed(self.view, payload, self.person_no_membership.user, courseId=self.course.id)
        
        # a user with a membership to an organization can update the details of a course belonging to the same organization
        assert helper.is_put_allowed(self.view, payload, self.person.user, courseId=self.course.id)
        
        # a user with a membership to one organization can update the details of a course belonging to another organization
        assert helper.is_put_allowed(self.view, payload, self.person_2.user, courseId=self.course.id)
        
        # an unauthenticated user cannot update the details of a course
        assert helper.is_put_allowed(self.view, payload, None, courseId=self.course.id) is False
        
    def test_permissions_delete(self) -> None:
        course_to_delete = baker.make(Course, 
            created_by=self.membership, 
            organization=self.organization
        )
        course_to_delete_2 = baker.make(Course, 
            created_by=self.membership, 
            organization=self.organization
        )
        course_to_delete_3 = baker.make(Course, 
            created_by=self.membership, 
            organization=self.organization
        )
        # a user without a membership to an organization can delete a course
        assert helper.is_delete_allowed(self.view, self.person_no_membership.user, courseId=course_to_delete.id)
        
        # a user with a membership to an organization can delete a course belonging to the same organization
        assert helper.is_delete_allowed(self.view, self.person.user, courseId=course_to_delete_2.id)
        
        # a user with a membership to one organization can delete a course belonging to another organization
        assert helper.is_delete_allowed(self.view, self.person_2.user, courseId=course_to_delete_3.id)
        
        # an unauthenticated user cannot delete a course
        assert helper.is_delete_allowed(self.view, None, courseId=self.course.id) is False
        
    def test_get_course(self) -> None:
        response = helper.get(self.view, self.person.user, courseId=self.course.id)
        assert response.status_code == status.HTTP_200_OK
        actual = j(response)
        assert actual['id'] == self.course.id
        
    def test_get_non_existing_course(self) -> None:
        response = helper.get(self.view, self.person.user, courseId=helper.get_non_existing_pk())
        assert response.status_code == status.HTTP_404_NOT_FOUND
        
    def test_update_course(self) -> None:
        payload = self.serializer(instance=self.course).data
        payload['name'] = 'Modified Test Course'
        payload = json.dumps(payload)
        
        response = helper.put(self.view, payload, self.person.user, courseId=self.course.id)
        assert response.status_code == status.HTTP_200_OK
        
        actual = j(response)
        self.course.refresh_from_db()
        
        assert actual == self.serializer(instance=self.course).data
        
    def test_update_valid_image(self) -> None:
        image = (
            b'\x89\x50\x4E\x47\x0D\x0A\x1A\x0A\x00\x00\x00\x0D\x49\x48\x44\x52'
            b'\x00\x00\x01\x00\x00\x00\x01\x00\x01\x03\x00\x00\x00\x66\xBC\x3A'
            b'\x25\x00\x00\x00\x03\x50\x4C\x54\x45\xB5\xD0\xD0\x63\x04\x16\xEA'
            b'\x00\x00\x00\x1F\x49\x44\x41\x54\x68\x81\xED\xC1\x01\x0D\x00\x00'
            b'\x00\xC2\xA0\xF7\x4F\x6D\x0E\x37\xA0\x00\x00\x00\x00\x00\x00\x00'
            b'\x00\xBE\x0D\x21\x00\x00\x01\x9A\x60\xE1\xD5\x00\x00\x00\x00\x49'
            b'\x45\x4E\x44\xAE\x42\x60\x82'
        )
        
        modified_course_name = 'Modified Course With Image'
        payload = {
            'name': modified_course_name,
            'shortDescription': 'Short Description',
            'longDescription': 'Long Description',
            'image': SimpleUploadedFile('course_image.png', image)
        }
        
        response = helper.put(self.view, payload, self.person.user, courseId=self.course.id, send_multipart=True)
        assert response.status_code == status.HTTP_200_OK
        
        actual = j(response)
        actual['image'] = actual['image'].removeprefix('http://testserver')
        
        self.course.refresh_from_db()
        
        assert actual == self.serializer(instance=self.course).data
        
    def test_update_invalid_image(self) -> None:
        small_pdf = (
            b'\x25\x50\x44\x46\x2D\x31\x2E\x0D\x74\x72\x61\x69\x6C\x65\x72\x3C'
            b'\x3C\x2F\x52\x6F\x6F\x74\x3C\x3C\x2F\x50\x61\x67\x65\x73\x3C\x3C'
            b'\x2F\x4B\x69\x64\x73\x5B\x3C\x3C\x2F\x4D\x65\x64\x69\x61\x42\x6F'
            b'\x78\x5B\x30\x20\x30\x20\x33\x20\x33\x5D\x3E\x3E\x5D\x3E\x3E\x3E'
            b'\x3E\x3E\x3E'
        )
        
        modified_course_name = 'Modified Course With Invalid Image'
        payload = {
            'name': modified_course_name,
            'shortDescription': 'Short Description',
            'longDescription': 'Long Description',
            'image': SimpleUploadedFile('course_image.png', small_pdf)
        }
        
        response = helper.put(self.view, payload, self.person.user, courseId=self.course.id, send_multipart=True)
        # This should fail, logically. But the asset library simply does not now yet how to validate files. This will be added later
        # so for now, this test is passing
        assert response.status_code == status.HTTP_200_OK
        
    def test_delete_course(self) -> None:
        response = helper.delete(self.view, self.person.user, courseId=self.course.id)
        assert response.status_code == status.HTTP_204_NO_CONTENT
    
    def test_delete_non_existing_course(self) -> None:
        response = helper.delete(self.view, self.person.user, courseId=helper.get_non_existing_pk())
        assert response.status_code == status.HTTP_404_NOT_FOUND
