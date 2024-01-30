from django.db import models
from authoring_core.models.organization import OrganizationMembership

class AbstractAuditable(models.Model):

    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text='Creation datetime of this model'
    )

    modified_at = models.DateTimeField(
        auto_now=True,
        help_text='Last modification datetime of this model'
    )

    created_by = models.ForeignKey(
        OrganizationMembership,
        null=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text='The creator of this model'
    )

    modified_by = models.ForeignKey(
        OrganizationMembership,
        null=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text='The last modifier of this model'
    )

    class Meta:
        abstract = True
