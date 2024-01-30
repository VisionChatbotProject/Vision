from django.contrib import admin

from ordered_model.admin import OrderedTabularInline, OrderedInlineModelAdminMixin, OrderedModelAdmin
from authoring_course.models import Course, Chapter, Slide

class ChapterInline(OrderedTabularInline):
    model = Chapter
    fields: list = ['id', 'title', 'short_description', 'created_at', 'order', 'move_up_down_links']
    readonly_fields: list = ['created_at', 'order', 'move_up_down_links']
    ordering: list = ['order']
    extra = 1

class SlideInline(OrderedTabularInline):
    model = Slide
    fields: list = ['id', 'title', 'content', 'created_at', 'order', 'move_up_down_links']
    readonly_fields: list = ['created_at', 'order', 'move_up_down_links']
    ordering: list = ['order']
    extra = 1

@admin.register(Course)
class CourseAdmin(OrderedInlineModelAdminMixin, admin.ModelAdmin):
    inlines = (ChapterInline, )

@admin.register(Chapter)
class ChapterAdmin(OrderedInlineModelAdminMixin, admin.ModelAdmin):
    inlines = (SlideInline, )

@admin.register(Slide)
class SlideAdmin(admin.ModelAdmin):
    pass
