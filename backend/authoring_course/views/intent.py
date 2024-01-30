from operator import index
from django.db import transaction
from django.http import HttpResponse
from django.http import FileResponse
from django.conf import settings
from django.utils import timezone
from rest_framework.generics import ListCreateAPIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import SAFE_METHODS
from rest_framework.permissions import IsAuthenticated


from authoring_course.serializers import CourseIntentSerializer
from authoring_course.models import CourseIntent
from authoring_course.models import Course
from authoring_core.models.organization import Organization
from authoring_core.models.organization import OrganizationMembership


class ListCreateCourseIntent(ListCreateAPIView):
    serializer_class = CourseIntentSerializer
    lookup_url_kwarg = 'courseId'
    
    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            self.permission_classes = [IsAuthenticated]
        elif self.request.method == 'POST':
            self.permission_classes = [IsAuthenticated]
            
        return super().get_permissions()
    
    def get_queryset(self):
        courseId = self.kwargs[self.lookup_url_kwarg]
        return CourseIntent.objects.filter(course_id=courseId)
    
    def perform_create(self, serializer):
        person = self.request.user.person
        with transaction.atomic():
            course = get_object_or_404(Course.objects, id=self.kwargs[self.lookup_url_kwarg])
            membership = get_object_or_404(OrganizationMembership.objects, person=person, organization_id=course.organization_id)
            
            serializer.save(created_by=membership, course=course)

    def get_serializer_context(self):
        return {
            **super().get_serializer_context(),
            'courseId': self.kwargs[self.lookup_url_kwarg]
        } 
            
class CourseIntentDetail(RetrieveUpdateDestroyAPIView):
    serializer_class = CourseIntentSerializer
    lookup_url_kwarg = 'intentId'
    
    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            self.permission_classes = [IsAuthenticated]
        elif self.request.method in ["PUT", "PATCH"]:
            self.permission_classes = [IsAuthenticated]
        elif self.request.method == 'DELETE':
            self.permission_classes = [IsAuthenticated]
            
        return super().get_permissions()
    
    def get_queryset(self):
        return CourseIntent.objects.filter(id=self.kwargs[self.lookup_url_kwarg])

