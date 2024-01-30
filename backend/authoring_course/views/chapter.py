from django.http import HttpResponse
from rest_framework.generics import ListCreateAPIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.generics import RetrieveAPIView
from django.db import transaction
from SmartAuthoring import settings
from authoring_course.serializers import ChapterSerializer
from authoring_course.models import Course
from authoring_course.models import Chapter
from authoring_core.models.organization import Organization, OrganizationMembership
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import SAFE_METHODS
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
import requests

class ListCreateChapter(ListCreateAPIView):
    serializer_class = ChapterSerializer
    lookup_url_kwarg = 'courseId'

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            self.permission_classes = [IsAuthenticated]
        elif self.request.method == 'POST':
            self.permission_classes = [IsAuthenticated]

        return super().get_permissions()

    def get_queryset(self):
        courseId = self.kwargs[self.lookup_url_kwarg]
        return Course.objects.get(id=courseId).chapters.all().order_by('order')

    def perform_create(self, serializer):
        person = self.request.user.person
        with transaction.atomic():
            course = get_object_or_404(Course.objects, id=self.kwargs[self.lookup_url_kwarg])
            organization = get_object_or_404(Organization.objects, id=course.organization.id)
            membership = get_object_or_404(OrganizationMembership.objects, person=person, organization_id=organization.id)
            serializer.save(created_by=membership, course=course)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['courseId'] = self.kwargs[self.lookup_url_kwarg]
        return context

class ChapterDetail(RetrieveUpdateDestroyAPIView):
    serializer_class = ChapterSerializer
    lookup_url_kwarg = 'chapterId'

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            self.permission_classes = [IsAuthenticated]
        elif self.request.method in ["PUT", "PATCH"]:
            self.permission_classes = [IsAuthenticated]
        elif self.request.method == 'DELETE':
            self.permission_classes = [IsAuthenticated]

        return super().get_permissions()

    def get_queryset(self):
        return Chapter.objects.filter(id=self.kwargs[self.lookup_url_kwarg])

    def get_serializer_context(self):
        context = super().get_serializer_context()
        chapter = get_object_or_404(Chapter.objects, id=self.kwargs[self.lookup_url_kwarg])
        context['courseId'] = chapter.course.id
        return context

class ChapterPerformance(RetrieveAPIView):
    lookup_url_kwarg = 'chapterId'

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def retrieve(self, request, *args, **kwargs):
        chapter = get_object_or_404(Chapter.objects, id=self.kwargs[self.lookup_url_kwarg])

        if (chapter.course.external_id is None or chapter.external_id is None):
            response = HttpResponse(-2)
            response.status_code = status.HTTP_412_PRECONDITION_FAILED
            return response

        # hotfix: graceful return if server is not available
        try:
            api_response = requests.post(settings.ACTIVE_BOTAPI_URL + "/get_quiz_performance/" + str(chapter.course.external_id) + "/" + str(chapter.external_id), timeout=0.5, verify=not settings.DEBUG)
        except:
            response = HttpResponse(-1)
            response.status_code = status.HTTP_200_OK
            return response

        response = HttpResponse(api_response)
        response.status_code = status.HTTP_200_OK
        return response