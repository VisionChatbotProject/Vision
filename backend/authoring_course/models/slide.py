from django.db import models

from ordered_model.models import OrderedModel

from authoring_core.models.organization import OrganizationMembership
from smartstudy_assets.models import Asset

from django.db.utils import IntegrityError

from authoring_course.models.chapter import Chapter

class Slide(OrderedModel):
    class Meta(OrderedModel.Meta):
        pass

    title = models.CharField(max_length=255)

    chapter = models.ForeignKey(Chapter, null=False, on_delete=models.CASCADE, related_name='slides')

    content = models.OneToOneField(Asset, null=True, on_delete=models.CASCADE, related_name='slide')

    created_by = models.ForeignKey(OrganizationMembership, null=True, on_delete=models.SET_NULL, related_name='created_slides')

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    order_with_respect_to = 'chapter'

    def save(self, *args, **kwargs):
        if self.pk is None and self.created_by is None:
            raise IntegrityError('Creating a new slide without a creator is not allowed')

        return super().save(*args, **kwargs)

    def __str__(self):
        return self.title
