from django.contrib.auth.admin import UserAdmin

from authoring_user.models import AuthoringUser
from authoring_user.models import AuthoringPerson
from authoring_user.models import AuthoringInvite

from django.contrib import admin

admin.site.register(AuthoringUser, UserAdmin)


class OrganizationMembershipsInlineAdmin(admin.TabularInline):
    model = AuthoringPerson.organizations.through


@admin.register(AuthoringPerson)
class AuthoringPersonAdmin(admin.ModelAdmin):
    inlines = (OrganizationMembershipsInlineAdmin,)


@admin.register(AuthoringInvite)
class AuthoringInviteAdmin(admin.ModelAdmin):
    list_display = ['email', 'code', 'used']
    pass
