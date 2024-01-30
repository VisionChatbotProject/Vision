from django.contrib import admin

from authoring_core.models import Organization
from authoring_core.models import OrganizationRole
from authoring_core.models import OrganizationMembership


class MembersInlineAdmin(admin.TabularInline):
    model = Organization.members.through
    extra = 1


class RolesInlineAdmin(admin.TabularInline):
    model = OrganizationRole
    extra = 1


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'memberlist']

    def memberlist(self, instance):
        return [member for member in instance.members.all()]

    inlines = [MembersInlineAdmin, RolesInlineAdmin]


@admin.register(OrganizationRole)
class OrganizationRoleAdmin(admin.ModelAdmin):
    pass


@admin.register(OrganizationMembership)
class OrganizationMembershipAdmin(admin.ModelAdmin):
    pass
