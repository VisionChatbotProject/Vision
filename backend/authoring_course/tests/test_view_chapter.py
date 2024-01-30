import json
from django_utils.testutils.helper import response_to_json as j
from django_utils.testutils import helper
from rest_framework.test import APITestCase
from rest_framework import status

from authoring_course.views import ListCreateChapter
from authoring_course.views import ChapterDetail
from authoring_user.models import AuthoringUser
from authoring_core.models.organization import Organization
from authoring_core.models.organization import OrganizationMembership
from authoring_course.models import Course
from authoring_course.models import Chapter
from authoring_course.serializers import ChapterSerializer

from model_bakery import baker
import pytest

class ListCreateChapterViewTestCase(APITestCase):
    
    @classmethod
    def setUpTestData(cls):
        cls.view = ListCreateChapter
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
        cls.course_2 = baker.make(Course, 
            name='Test Course 2', 
            short_description='short description',
            long_description='a longer description', 
            created_by=cls.membership_2, 
            organization=cls.organization_2
        )
        
        cls.chapter = baker.make(Chapter,title='Chapter One', 
            short_description='chapter one short', 
            long_description='chapter one long', 
            course=cls.course
        )
        
        cls.chapter_payload_title = 'Another New Chapter'
        cls.chapter_payload_short_description = 'short description for the new chapter'
        cls.chapter_payload_long_description = 'long description for the new chapter'
        
        cls.chapter_payload = json.dumps({
            'title': cls.chapter_payload_title,
            'shortDescription': cls.chapter_payload_short_description,
            'longDescription': cls.chapter_payload_long_description 
        })
        
    def test_permissions_get(self) -> None:
        # a user without a membership to an organization sees the chapters of a given course
        assert helper.is_get_allowed(self.view, self.person_no_membership.user, courseId=self.course.id)
        
        # a user with a membership to an organization sees all chapters of a given course
        assert helper.is_get_allowed(self.view, self.person.user, courseId=self.course.id)
        
        # a user with a membership to one organization sees all chapters of of a course that belongs to a different organization
        assert helper.is_get_allowed(self.view, self.person.user, courseId=self.course_2.id)
        
        # an unauthenticated user cannot see any chapters
        assert helper.is_get_allowed(self.view, None, courseId=self.course.id) is False
        
    def test_permissions_post(self) -> None:
        # a user without a membership to an organization cannot create chapters
        assert helper.is_post_allowed(self.view, self.chapter_payload, self.person_no_membership.user, courseId=self.course.id) is False
        
        # a user with a membership to an organization can create chapters for a course that is in the same organization
        assert helper.is_post_allowed(self.view, self.chapter_payload, self.person.user, courseId=self.course.id)
        
        # a user with a membership to one organization cannot create chapters for a course that belongs to another organization where the user has no membership
        assert helper.is_post_allowed(self.view, self.chapter_payload, self.person.user, courseId=self.course_2.id) is False
        
        # an unauthenticated user cannot create chapters
        assert helper.is_post_allowed(self.view, self.chapter_payload, None, courseId=self.course.id) is False
        
    def test_get(self) -> None:
        response = helper.get(self.view, self.person.user, courseId=self.course.id)
        assert response.status_code == status.HTTP_200_OK
        actual = j(response)
        assert len(actual) == 1
        assert actual[0]['id'] == self.chapter.id
        
    def test_post(self) -> None:
        response = helper.post(self.view, self.chapter_payload, self.person.user, courseId=self.course.id)
        assert response.status_code == status.HTTP_201_CREATED
        
        chapter = Chapter.objects.get(title=self.chapter_payload_title)
        
        assert chapter.title == self.chapter_payload_title
        assert chapter.created_by == self.membership
        assert chapter.course == self.course
        

class ChapterDetailViewTestCase(APITestCase):
    
    @classmethod
    def setUpTestData(cls):
        cls.view = ChapterDetail
        cls.serializer = ChapterSerializer

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
        cls.course_2 = baker.make(Course, 
            name='Test Course 2', 
            short_description='short description',
            long_description='a longer description', 
            created_by=cls.membership_2, 
            organization=cls.organization_2
        )
        
        cls.chapter = baker.make(Chapter,title='Chapter One', 
            short_description='chapter one short', 
            long_description='chapter one long', 
            course=cls.course
        )
        
    def test_permissions_get(self) -> None:
        # a user without a membership to an organization sees the chapter details of a course
        assert helper.is_get_allowed(self.view, self.person_no_membership.user, chapterId=self.chapter.id)
        
        # a user with a membership to an organization can see the chapter details of a course belonging to the same organization
        assert helper.is_get_allowed(self.view, self.person.user, chapterId=self.chapter.id) 
        
        # a user with a membership to one organization can see the chapter details of a course belonging to another organization
        assert helper.is_get_allowed(self.view, self.person_2.user, chapterId=self.chapter.id)
        
        # an unauthenticated user cannot see the chapter details of a course
        assert helper.is_get_allowed(self.view, None, chapterId=self.chapter.id) is False
        
    def test_permissions_put(self) -> None:
        payload = ChapterSerializer(instance=self.chapter).data
        payload['title'] = 'Modified Chapter One'
        payload = json.dumps(payload)
        
        # a user without a membership to an organization can update a course chapter
        assert helper.is_put_allowed(self.view, payload, self.person_no_membership.user, chapterId=self.chapter.id)
        
        # a user with a membership to an organization can update the details of a course chapter belonging to the same organization
        assert helper.is_put_allowed(self.view, payload, self.person.user, chapterId=self.chapter.id)
        
        # a user with a membership to one organization can update the details of a course chapter belonging to another organization
        assert helper.is_put_allowed(self.view, payload, self.person_2.user, chapterId=self.chapter.id)
        
        # an unauthenticated user cannot update the details of a course chapter
        assert helper.is_put_allowed(self.view, payload, None, chapterId=self.chapter.id) is False
        
    def test_permissions_delete(self) -> None:
        chapter_to_delete = baker.make(Chapter, course=self.course)
        chapter_to_delete_2 = baker.make(Chapter, course=self.course)
        chapter_to_delete_3 = baker.make(Chapter, course=self.course)

        # a user without a membership to an organization can delete a course chapter
        assert helper.is_delete_allowed(self.view, self.person_no_membership.user, chapterId=chapter_to_delete.id)
        
        # a user with a membership to an organization can delete a course chapter belonging to the same organization
        assert helper.is_delete_allowed(self.view, self.person.user, chapterId=chapter_to_delete_2.id)
        
        # a user with a membership to one organization can delete a course chapter belonging to another organization
        assert helper.is_delete_allowed(self.view, self.person_2.user, chapterId=chapter_to_delete_3.id)
        
        # an unauthenticated user cannot delete a course chapter
        assert helper.is_delete_allowed(self.view, None, chapterId=self.chapter.id) is False
        
    def test_get_chapter(self) -> None:
        response = helper.get(self.view, self.person.user, chapterId=self.chapter.id)
        assert response.status_code == status.HTTP_200_OK
        actual = j(response)
        assert actual['id'] == self.chapter.id
        
    def test_get_non_existing_chapter(self) -> None:
        response = helper.get(self.view, self.person.user, chapterId=helper.get_non_existing_pk())
        assert response.status_code == status.HTTP_404_NOT_FOUND
        
    def test_update_chapter(self) -> None:
        payload = self.serializer(instance=self.chapter).data
        payload['title'] = 'Modified Chapter One'
        payload = json.dumps(payload)
        
        response = helper.put(self.view, payload, self.person.user, chapterId=self.chapter.id)
        assert response.status_code == status.HTTP_200_OK
        
        actual = j(response)
        self.chapter.refresh_from_db()
        
        assert actual == self.serializer(instance=self.chapter).data
        
    def test_delete_chapter(self) -> None:
        response = helper.delete(self.view, self.person.user, chapterId=self.chapter.id)
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
    def test_delete_non_existing_chapter(self) -> None:
        response = helper.delete(self.view, self.person.user, chapterId=helper.get_non_existing_pk())
        assert response.status_code == status.HTTP_404_NOT_FOUND
