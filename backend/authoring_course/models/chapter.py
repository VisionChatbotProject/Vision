from django.db import IntegrityError, models

from ordered_model.models import OrderedModel

from authoring_course.models import Course
from authoring_core.models import AbstractSynchronizableBase
from authoring_core.models.synchronization import SynchronizationDefinition
from authoring_core.models.organization import OrganizationMembership

class Chapter(AbstractSynchronizableBase, OrderedModel):
    class Meta(OrderedModel.Meta):
        pass

    title = models.CharField(max_length=255)
    short_description = models.TextField()
    long_description = models.TextField()

    course = models.ForeignKey(Course, null=False, on_delete=models.CASCADE, related_name='chapters')
    parent = models.ForeignKey('self', null=True, related_name='chapters', on_delete=models.CASCADE, default=None)

    created_by = models.ForeignKey(OrganizationMembership, null=True, on_delete=models.SET_NULL, related_name='created_chapters')

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    order_with_respect_to = 'course'

    def save(self, *args, **kwargs):

        if self.pk:

            # check if i have a parent
            if self.parent is not None:
                # check the course_id of my parent
                if self.course_id != self.parent.course_id:
                    raise IntegrityError('Course mismatch (self and parent must be in the same course)')

            # check a circular dependency
            parent = self
            id_list = []
            id_list.append(parent.id)
            while parent.parent is not None:
                id_list.append(parent.parent.id)
                if len(set(id_list)) != len(id_list):
                    raise IntegrityError('Circular dependency found!')
                parent = parent.parent

        if self.pk is None:
            if self.course_id is None and self.parent_id is not None:
                self.course_id = self.parent.course.id

        return super().save(*args, **kwargs)

    def _get_synchonization_definition(self):
        return SynchronizationDefinition('chapter')

    def _get_payload(self):
        return {
            "id_course": self.course.external_id,
            "name_chapter": self.title,
            "short_description": self.short_description,
            "content": self.long_description
        }

    def __str__(self):
        return self.title
