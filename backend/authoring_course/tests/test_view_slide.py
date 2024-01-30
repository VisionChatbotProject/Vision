from django.core.files.uploadedfile import SimpleUploadedFile

from rest_framework.test import APITestCase
from rest_framework import status

from smartstudy_assets.models import Asset

from authoring_user.models import AuthoringUser
from authoring_core.models.organization import Organization
from authoring_core.models.organization import OrganizationMembership

from authoring_course.views import ListCreateSlide
from authoring_course.views import SlideDetail
from authoring_course.models import Course
from authoring_course.models import Chapter
from authoring_course.models import Slide
from authoring_course.serializers import SlideSerializer

from django_utils.testutils import helper
from django_utils.testutils.helper import response_to_json as j

from model_bakery import baker
import pytest

class ListCreateSlideViewTestCase(APITestCase):
    
    @classmethod
    def setUpTestData(cls):
        cls.view = ListCreateSlide
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
        cls.chapter = baker.make(Chapter,title='Chapter One', 
            short_description='chapter one short', 
            long_description='chapter one long', 
            course=cls.course
        )
        
        cls.slide_title = 'Slide One'
        cls.slide = baker.make(Slide, 
            title=cls.slide_title, 
            chapter=cls.chapter, 
            created_by=cls.membership
        )
        
        cls.slide_sample_content_data = b'<html><body>Slide Sample Content</body></html>'
        cls.slide_sample_content = SimpleUploadedFile('slide_content.html', cls.slide_sample_content_data)
        
        cls.new_slide_title = 'New Slide'
        cls.slide_payload = {
            'title': cls.new_slide_title,
            'content': cls.slide_sample_content
        }
        
    def test_permissions_get(self) -> None:
        # a user without a membership to an organization sees the slides of a chapter
        assert helper.is_get_allowed(self.view, self.person_no_membership.user, chapterId=self.chapter.id)
        
        # a user with a membership to an organization sees all slides from a chapter of the same organization
        assert helper.is_get_allowed(self.view, self.person.user, chapterId=self.chapter.id)
        
        # a user with a membership to one organization sees all slides from a chapter of another organization
        assert helper.is_get_allowed(self.view, self.person_2.user, chapterId=self.chapter.id)
        
        # an unauthenticated user cannot see any slides
        assert helper.is_get_allowed(self.view, None, chapterId=self.chapter.id) is False
        
    def test_permissions_post(self) -> None:
        # a user without a membership to an organization cannot create slides
        assert helper.is_post_allowed(self.view, self.slide_payload, self.person_no_membership.user, chapterId=self.chapter.id, send_multipart=True) is False
        
        # a user with a membership to an organization can create slides for chapters in the same organization
        assert helper.is_post_allowed(self.view, self.slide_payload, self.person.user, chapterId=self.chapter.id, send_multipart=True) 
        
        # a user with a membership to one organization cannot create slides for chapters in another organization to which he does not have a membership
        assert helper.is_post_allowed(self.view, self.slide_payload, self.person_2.user, chapterId=self.chapter.id, send_multipart=True) is False
        
        # an unauthenticated user cannot create a new slide
        assert helper.is_post_allowed(self.view, self.slide_payload, None, chapterId=self.chapter.id, send_multipart=True) is False
        
    def test_get(self) -> None:
        response = helper.get(self.view, self.person.user, chapterId=self.chapter.id)
        assert response.status_code == status.HTTP_200_OK
        actual = j(response)
        assert len(actual) == 1
        assert actual[0]['id'] == self.slide.id
        assert actual[0]['title'] == self.slide_title
        
    def test_post_with_content(self) -> None:
        slide_count = Slide.objects.count()
        
        response = helper.post(self.view, self.slide_payload, self.person.user, chapterId=self.chapter.id, send_multipart=True)
        assert response.status_code == status.HTTP_201_CREATED
        assert Slide.objects.count() == slide_count + 1
        
        slide = Slide.objects.get(title=self.new_slide_title)
        
        assert slide.title == self.new_slide_title
        assert slide.chapter == self.chapter
        assert slide.created_by == self.membership
        
    def test_post_without_content(self) -> None:
        slide_count = Slide.objects.count()
        
        slide_title = 'Another New Slide'
        payload = {
            'title': slide_title
        }
        
        response = helper.post(self.view, payload, self.person.user, send_multipart=True, chapterId=self.chapter.id)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert Slide.objects.count() == slide_count + 1
        
        
class SlideDetailViewTestCase(APITestCase):
    
    @classmethod
    def setUpTestData(cls):
        cls.view = SlideDetail
        cls.serializer = SlideSerializer

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
        cls.chapter = baker.make(Chapter,title='Chapter One', 
            short_description='chapter one short', 
            long_description='chapter one long', 
            course=cls.course
        )
        
        cls.slide_content_data =  b'<html><body>Slide Sample Data</body></html>'
        cls.slide_content = Asset.objects.create(file=SimpleUploadedFile('slide_content.html', cls.slide_content_data))
        
        cls.slide = baker.make(Slide, 
            chapter=cls.chapter, 
            created_by=cls.membership, 
            content=cls.slide_content)
        
    def test_permissions_get(self) -> None:
        # a user without a membership to an organization sees the details of a slide
        assert helper.is_get_allowed(self.view, self.person_no_membership.user, slideId=self.slide.id)
        
        # a user with a membership to an organization can see the details of a slide belonging to the same organization
        assert helper.is_get_allowed(self.view, self.person.user, slideId=self.slide.id)
        
        # a user with a membership to one organization can see the details of a slide belonging to another organization
        assert helper.is_get_allowed(self.view, self.person_2.user, slideId=self.slide.id)
        
        # an unauthenticated user cannot see the details of a slide
        assert helper.is_get_allowed(self.view, None, slideId=self.slide.id) is False
        
    def test_permissions_put(self) -> None:
        payload = SlideSerializer(instance=self.slide).data
        payload['title'] = 'Modified Slide One'
        
        # a user without a membership to an organization can update a slide
        assert helper.is_put_allowed(self.view, payload, self.person_no_membership.user, slideId=self.slide.id, send_multipart=True)
        
        # a user with a membership to an organization can update the details of a slide belonging to the same organization
        assert helper.is_put_allowed(self.view, payload, self.person.user, slideId=self.slide.id, send_multipart=True)
        
        # a user with a membership to one organization can update the details of a slide belonging to another organization
        assert helper.is_put_allowed(self.view, payload, self.person_2.user, slideId=self.slide.id, send_multipart=True)
        
        # an unauthenticated user cannot update the details of a slide
        assert helper.is_put_allowed(self.view, payload, None, slideId=self.slide.id, send_multipart=True) is False
        
    def test_permissions_delete(self) -> None:
        
        slide_to_delete = baker.make(Slide, 
            chapter=self.chapter,
            created_by=self.membership, 
        )
        slide_to_delete_2 = baker.make(Slide, 
            chapter=self.chapter,
            created_by=self.membership, 
        )
        slide_to_delete_3 = baker.make(Slide, 
            chapter=self.chapter,
            created_by=self.membership, 
        )
        
        # a user without a membership to an organization can delete a slide
        assert helper.is_delete_allowed(self.view, self.person_no_membership.user, slideId=slide_to_delete.id)
        
        # a user with a membership to an organization can delete a slide belonging to the same organization
        assert helper.is_delete_allowed(self.view, self.person.user, slideId=slide_to_delete_2.id)
        
        # a user with a membership to one organization can delete a slide belonging to another organization
        assert helper.is_delete_allowed(self.view, self.person_2.user, slideId=slide_to_delete_3.id)
        
        # an unauthenticated user cannot delete a slide
        assert helper.is_delete_allowed(self.view, None, slideId=self.slide.id) is False
        
    def test_get_slide(self) -> None:
        response = helper.get(self.view, self.person.user, slideId=self.slide.id)
        assert response.status_code == status.HTTP_200_OK
        actual = j(response)
        assert actual['id'] == self.slide.id 
        
    def test_get_non_existing_slide(self) -> None:
        response = helper.get(self.view, self.person.user, slideId=helper.get_non_existing_pk())
        assert response.status_code == status.HTTP_404_NOT_FOUND
        
    def test_update_slide_title_and_content(self) -> None:
        slide_sample_content_data = b'<html><body>Modified Slide Sample Data</body></html>'
        slide_sample_content = SimpleUploadedFile('modified_slide_content.html', slide_sample_content_data)
        
        payload = self.serializer(instance=self.slide).data
        payload['title'] = 'Modified Slide Title'
        payload['content'] = slide_sample_content
        
        response = helper.put(self.view, payload, self.person.user, send_multipart=True, slideId=self.slide.id)
        assert response.status_code == status.HTTP_200_OK
        
        actual = j(response)
        
        self.slide.refresh_from_db()
        slide = self.serializer(instance=self.slide).data
        
        assert actual['title'] == slide['title']
        assert actual['content'].removeprefix('http://testserver') == slide['content']
        
    def test_update_slide_title(self) -> None:
        payload = self.serializer(instance=self.slide).data
        payload['title'] = 'New Modified Slide Title'
        del payload['content']
        
        response = helper.put(self.view, payload, self.person.user, send_multipart=True, slideId=self.slide.id)
        assert response.status_code == status.HTTP_200_OK
        
        actual = j(response)
        self.slide.refresh_from_db()
        slide = self.serializer(instance=self.slide).data
        
        assert actual['title'] == slide['title']
        
    def test_delete_slide(self) -> None:
        response = helper.delete(self.view, self.person.user, slideId=self.slide.id)
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
    def test_delete_non_existing_slide(self) -> None:
        response = helper.delete(self.view, self.person.user, slideId=helper.get_non_existing_pk())
        assert response.status_code, status.HTTP_404_NOT_FOUND
        