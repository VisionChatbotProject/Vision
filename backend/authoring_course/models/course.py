from smartstudy_assets.models import Asset, AssetStore

from django.db import models
from authoring_core.models.organization import Organization
from authoring_core.models import AbstractAuditable
from authoring_core.models.synchronization import AbstractSynchronizableBase, SynchronizationDefinition

class Course(AbstractAuditable, AbstractSynchronizableBase):

    name = models.CharField(max_length=255)
    short_description = models.TextField()
    long_description = models.TextField()

    image = models.OneToOneField(Asset, null=True, on_delete=models.CASCADE, related_name='course')

    assets = models.OneToOneField(AssetStore, null=True, on_delete=models.CASCADE, related_name='course')

    organization = models.ForeignKey(Organization, null=False, on_delete=models.CASCADE, related_name='courses')

    course_begin_date = models.DateTimeField(null=True)
    course_end_date = models.DateTimeField(null=True)
    materials = models.TextField()
    ressources = models.TextField()
    teacher_name = models.CharField(max_length=255)
    teacher_email = models.EmailField(max_length=255)

    def save(self, *args, **kwargs):
        if self.assets is None:
            store = AssetStore.objects.create(name='store_' + self.name)
            self.assets = store

        super().save(*args, **kwargs)

    def _get_synchonization_definition(self):
        return SynchronizationDefinition('course')

    def _get_payload(self):
        return {
            "name": self.name,
            "description": self.long_description,
            "teacher": self.teacher_name,
            "email_teacher": self.teacher_email,
            "chapters": '\n'.join([chapter.title for chapter in self.chapters.all()]),
            "materials": self.materials,
            "externresources": self.ressources,
            'course_start': self.course_begin_date,
            'course_end': self.course_end_date,
        }

    def __str__(self):
        return self.name
