

from django.test import TestCase
from django.db import IntegrityError
from django.core.files.uploadedfile import SimpleUploadedFile

from smartstudy_assets.models import Asset

from authoring_user.models import AuthoringUser
from authoring_core.models.organization import Organization
from authoring_core.models.organization import OrganizationMembership

from authoring_course.models import Course
from authoring_course.models import Chapter
from authoring_course.models import Slide

from model_bakery import baker
import pytest

class SlideTestCase(TestCase):
    
    @classmethod
    def setUpTestData(cls):
        cls.person = baker.make(AuthoringUser).person 
        cls.organization = baker.make(Organization)
        cls.member = baker.make(OrganizationMembership,
            person = cls.person,
            organization = cls.organization,
            role=cls.organization.get_admin_role()
        )
        cls.course = baker.make(Course,name='Test Course 1', organization=cls.organization)

        cls.chapter = baker.make(Chapter, title='Test Chapter 1', course=cls.course)
        
        cls.slide_sample_content = b'<html><body>Slide Sample Content</body></html>'
        
    def test_create(self) -> None:
        slide_title = 'Slide Title 1'
        
        baker.make(Slide, title=slide_title, 
            chapter=self.chapter, 
            created_by=self.member
        )
        
        assert Slide.objects.count() == 1
        
        slide = Slide.objects.first()
        
        assert slide.title == slide_title
        assert slide.content is None
        assert slide.chapter == self.chapter
        assert slide.created_by == self.member
        assert slide.created_at is not None
        assert slide.modified_at is not None
        
    def test_without_chapter(self) -> None:
        with pytest.raises(IntegrityError):
            slide_title = 'Slide Title 2'
            baker.make(Slide, title=slide_title, chapter=None)
        
    def test_with_created_by(self) -> None:
        slide_title = 'Slide Title 3'
        
        baker.make(Slide, title=slide_title, 
            chapter=self.chapter, 
            created_by=self.member
        )
        
        assert Slide.objects.count() == 1
        
        slide = Slide.objects.first()
        
        assert slide.created_by == self.member
        
    def test_with_content(self) -> None:
        slide_title = 'Slide Title 4'
        file = SimpleUploadedFile('slide_content.html', self.slide_sample_content)
        
        asset = Asset.objects.create(file=file)

        baker.make(Slide, title=slide_title, 
            chapter=self.chapter, 
            content=asset, 
            created_by=self.member
        )
        
        assert Slide.objects.count() == 1
        
        slide = Slide.objects.first()
        slide_content = slide.content.read()
        
        assert slide_content == self.slide_sample_content
