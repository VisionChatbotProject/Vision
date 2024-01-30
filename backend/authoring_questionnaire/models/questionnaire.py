from django.db import models
from django.db.models import Q
from authoring_core.models.organization import OrganizationMembership
from authoring_core.models.synchronization import AbstractSynchronizableBase, SynchronizationDefinition
from authoring_course.models import Course, Chapter

class Questionnaire(AbstractSynchronizableBase):

    title = models.CharField(max_length=255, default='Questionnaire')

    created_by = models.ForeignKey(OrganizationMembership, null=True, on_delete=models.SET_NULL, related_name='created_questionnaires')
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='questionnaires')
    chapter = models.OneToOneField(Chapter, null=True, default=None, on_delete=models.CASCADE, related_name="questionnaire")

    def _get_synchonization_definition(self):
        return SynchronizationDefinition('quiz')

    def _get_payload(self):
        chapter = self.chapter.external_id if self.chapter is not None else -1
        return {
            "id_course": self.course.external_id,
            "id_chapter": chapter,
            "quiz_name": self.title,
        }