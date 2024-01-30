from django.db import transaction

from rest_framework.generics import ListCreateAPIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import SAFE_METHODS
from rest_framework.permissions import IsAuthenticated

from authoring_core.models.organization import Organization, OrganizationMembership
from authoring_course.models.chapter import Chapter
from authoring_course.models.course import Course
from authoring_course.serializers import SlideSerializer
from smartstudy_assets.views import ServeAssetView

from authoring_course.models import Slide


class ListCreateSlide(ListCreateAPIView):
    serializer_class = SlideSerializer
    lookup_url_kwarg = 'chapterId'

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            self.permission_classes = [IsAuthenticated]
        elif self.request.method == 'POST':
            self.permission_classes = [IsAuthenticated]

        return super().get_permissions()

    def get_queryset(self):
        chapterId = self.kwargs[self.lookup_url_kwarg]
        return Chapter.objects.get(id=chapterId).slides.all().order_by('order')

    def perform_create(self, serializer):
        person = self.request.user.person
        with transaction.atomic():
            chapter = get_object_or_404(Chapter.objects, id=self.kwargs[self.lookup_url_kwarg])
            course = get_object_or_404(Course.objects, id=chapter.course.id)
            organization = get_object_or_404(Organization.objects, id=course.organization.id)
            membership = get_object_or_404(OrganizationMembership.objects, person=person, organization_id=organization.id)
            serializer.save(created_by=membership, chapter=chapter)

class SlideDetail(RetrieveUpdateDestroyAPIView):
    serializer_class = SlideSerializer
    lookup_url_kwarg = 'slideId'

    def get_queryset(self):
        return Slide.objects.filter(id=self.kwargs[self.lookup_url_kwarg])

class ServeSlideAsset(ServeAssetView):
    # TODO: Permission checks

    asset_field_name = 'content'
    fallback_file = 'slide.json'

    def get_object(self):
        return get_object_or_404(Slide, pk=self.kwargs['slideId']).content

    def get_parent(self):
        return get_object_or_404(Slide, pk=self.kwargs['slideId'])
