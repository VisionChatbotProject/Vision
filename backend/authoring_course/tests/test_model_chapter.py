from django.test import TestCase
from django.db import IntegrityError

from authoring_user.models import AuthoringUser
from authoring_core.models.organization import Organization
from authoring_core.models.organization import OrganizationMembership
from authoring_course.models import Course
from authoring_course.models import Chapter

from model_bakery import baker
import pytest


class ChapterTestCase(TestCase):
    
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

    def test_create(self) -> None:
        chapter_title = 'Test Chapter 1'

        chapter = baker.make(Chapter, title=chapter_title, course=self.course)

        assert Chapter.objects.count() == 1

        new_chapter = Chapter.objects.first()

        assert chapter.title == chapter_title
        assert chapter.short_description == new_chapter.short_description
        assert chapter.long_description == new_chapter.long_description
        assert chapter.created_by == new_chapter.created_by
        assert chapter.created_at is not None
        assert chapter.modified_at is not None

    def test_create_without_course(self) -> None:
        with pytest.raises(IntegrityError):
            chapter_title = 'Test Chapter 1'
            baker.make(Chapter, title=chapter_title, course=None)

    def test_create_with_short_description(self) -> None:
        chapter_title = 'Test Chapter 1'
        short_description = 'A Sample description'

        baker.make(Chapter, title=chapter_title, 
            short_description=short_description, 
            course=self.course
        )

        assert Chapter.objects.count() == 1

        chapter = Chapter.objects.first()
        assert chapter.short_description == short_description

    def test_create_with_long_description(self) -> None:
        chapter_title = 'Test Chapter 1'
        long_description = 'A Long description'

        baker.make(Chapter, title=chapter_title, 
            long_description=long_description, 
            course=self.course
        )

        assert Chapter.objects.count() == 1

        chapter = Chapter.objects.first()
        assert chapter.long_description == long_description

    def test_create_with_created_by(self) -> None:
        chapter_title = 'Test Chapter 1'
        baker.make(Chapter, title=chapter_title, 
            created_by=self.member, 
            course=self.course
        )

        assert Chapter.objects.count() == 1

        chapter = Chapter.objects.first()
        assert chapter.created_by == self.member

    def test_parent_chapter(self) -> None:
        root_chapter_title = 'Root Chapter'
        sub_chapter_title = 'Sub Chapter'
        
        root_chapter = baker.make(Chapter, title=root_chapter_title, course=self.course)
        sub_chapter = baker.make(Chapter, title=sub_chapter_title, parent=root_chapter, course=self.course)
        
        assert root_chapter.chapters.all().count() == 1
        assert Chapter.objects.filter(title=sub_chapter.title).exists() == True
        
    def test_delete_sub_chapters(self) -> None:
        root_chapter = baker.make(Chapter, title='Root Chapter', course=self.course)
        sub_chapter_one = baker.make(Chapter, title='Sub Chapter One', parent=root_chapter, course=self.course)
        sub_chapter_two = baker.make(Chapter, title='Sub Chapter Two', parent=root_chapter, course=self.course)
        
        assert root_chapter.chapters.all().count() == 2
        sub_chapter_one.delete()
        assert root_chapter.chapters.all().count() == 1
        sub_chapter_two.delete()
        assert root_chapter.chapters.all().count() == 0
        
    def test_adapt_parent_course_id(self) -> None:
        root_chapter = baker.make(Chapter, title='Root Chapter', course=self.course)
        sub_chapter = baker.make(Chapter, title='Sub Chapter One',course=self.course, parent=root_chapter)
        
        assert sub_chapter.course.id == root_chapter.course.id
        
    def test_delete_root_chapter(self) -> None:
        root_chapter = baker.make(Chapter, title='Root Chapter', course=self.course)
        sub_chapter_one = baker.make(Chapter, title='Sub Chapter One', parent=root_chapter, course=self.course)
        sub_chapter_two = baker.make(Chapter, title='Sub Chapter Two', parent=root_chapter, course=self.course)
        
        root_chapter.delete()
        
        assert Chapter.objects.filter(title=sub_chapter_one.title).exists() == False
        assert Chapter.objects.filter(title=sub_chapter_two.title).exists() == False
        
    def test_circular_dependency(self) -> None:
        with pytest.raises(IntegrityError):
            root_chapter = baker.make(Chapter,title='Root Chapter', course=self.course)
            sub_chapter_one = baker.make(Chapter,title='Sub Chapter One', parent=root_chapter)
            sub_chapter_two = baker.make(Chapter,title='Sub Chapter Two', parent=sub_chapter_one)
        
            root_chapter.parent = sub_chapter_two
            root_chapter.save()
        
