from django.db import transaction
from django.http import HttpResponse, JsonResponse
from django.http import FileResponse
from django.conf import settings
from django.utils import timezone
from rest_framework.generics import ListCreateAPIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import SAFE_METHODS
from rest_framework.permissions import IsAuthenticated

from rest_framework import status

from smartstudy_assets.views import ServeAssetView
from smartstudy_assets.views import ListCreateAssetForStore
from authoring_course.models.chapter import Chapter

from authoring_course.serializers import CourseSerializer
from authoring_course.serializers import CourseAssetSerializer
from authoring_course.models import Course
from authoring_course.models import Slide
from authoring_core.models.organization import Organization
from authoring_core.models.organization import OrganizationMembership

from authoring_course.workflows import export

import os
import shutil

import py_scorm.scorm_12 as scorm12

import requests
import docker
import json
import uuid
from datetime import datetime

class ListCreateCourse(ListCreateAPIView):
    serializer_class = CourseSerializer
    lookup_url_kwarg = 'orgId'

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            self.permission_classes = [IsAuthenticated]
        elif self.request.method == 'POST':
            self.permission_classes = [IsAuthenticated]

        return super().get_permissions()

    def get_queryset(self):
        orgId = self.kwargs[self.lookup_url_kwarg]
        return Course.objects.filter(created_by__organization_id=orgId)

    def perform_create(self, serializer):
        person = self.request.user.person
        with transaction.atomic():
            organization = get_object_or_404(Organization.objects, id=self.kwargs[self.lookup_url_kwarg])
            membership = get_object_or_404(OrganizationMembership.objects, person=person, organization_id=self.kwargs[self.lookup_url_kwarg])
            serializer.save(created_by=membership, organization=organization)

class CourseDetail(RetrieveUpdateDestroyAPIView):
    serializer_class = CourseSerializer
    lookup_url_kwarg = 'courseId'

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            self.permission_classes = [IsAuthenticated]
        elif self.request.method in ["PUT", "PATCH"]:
            self.permission_classes = [IsAuthenticated]
        elif self.request.method == 'DELETE':
            self.permission_classes = [IsAuthenticated]

        return super().get_permissions()

    def get_queryset(self):
        return Course.objects.filter(id=self.kwargs[self.lookup_url_kwarg])

class ServeCourseImage(ServeAssetView):
    fallback_file = 'course_default.png'
    lookup_field = 'pk'
    lookup_url_kwarg='assetPk'


class ListCreateCourseAsset(ListCreateAssetForStore):

    serializer_class = CourseAssetSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['courseId'] = self.kwargs['courseId']
        return context

    def get_object(self):
        course = get_object_or_404(Course, id=self.kwargs['courseId'])
        return course.assets


class ServeCourseAsset(ServeAssetView):

    fallback_file = 'course_default.png'
    # lookup_field = 'file'
    # lookup_url_kwarg='name'


class ExportCourseViewHelper():

    def retrieve(self, request, *args, **kwargs):
        courseId = kwargs['courseId']
        course = Course.objects.get(id=courseId)

        scorm = scorm12.Scorm12(course.name)
        scorm_assets = scorm12.SharedResource('assets', 'assets')

        slides = list(Slide.objects.filter(chapter__course_id=course.id))
        course_assets = course.assets.assets.all()

        now = timezone.now()
        base_directory = os.path.join(settings.TEMP_DIR, now.strftime('%Y%m%dT%H%M%S%f'))
        output_directory = os.path.join(base_directory, course.name)

        os.makedirs(output_directory)

        processed_slides = []
        add_shared = False
        slides.reverse()
        all_assets = set()
        for slide in slides:

            try:
                grapes_content = slide.content.read()
            except:
                grapes_content = open(os.path.join(settings.SMART_STUDY_ASSET_DEFAULT_STORE_LOCATION, 'slide.json'), 'rb').read()

            html = export.parse_grapes_content(grapes_content)
            html, assets = export.replace_asset_links(html, '../assets/', course_assets)
            for asset in assets:
                all_assets.add(asset)

            new_slide = export.write_slide(str(slide.id), html, output_directory)
            processed_slides.append(new_slide)


        for asset in all_assets:
            scorm_assets.add_file(asset.file.path)
            add_shared = True

        index_template = os.path.join(settings.SCORM_RESOURCES, 'index.html')
        with open(index_template, 'r') as file:
            index_template = file.read()

        index = export.create_index(index_template, processed_slides)

        with open(os.path.join(output_directory, 'index.html'), 'w') as file:
            file.write(index)

        scorm_course = scorm12.Resource('course', output_directory +  '/index.html', 'course')
        for slide in processed_slides:
            scorm_course.add_file(os.path.join(output_directory, slide))

        if add_shared:
            scorm_course.add_dependency(scorm_assets)


        slides.reverse()
        courseData = {
            "course": {
                "name": course.name,
                "id": course.id,
                "external_id": course.external_id,
            },
            "chapters": [{"title": chapter.title, "order": chapter.order, "id": chapter.id, "external_id": chapter.external_id} for chapter in Chapter.objects.filter(course_id=courseId)],
            "slides": [{"title": slide.title, "order": index, "id": slide.id, "chapter_external_id": slide.chapter.external_id} for index, slide in enumerate(slides)]
        }
        with open(os.path.join(output_directory, 'course.json'), 'w', encoding='utf-8') as file:
            json.dump(courseData, file, indent=4)

        scorm_course.add_file(os.path.join(output_directory, 'course.json'))
        scorm_course.add_file(os.path.join(settings.SCORM_RESOURCES, 'navigation.js'))
        scorm_course.add_file(os.path.join(settings.SCORM_RESOURCES, 'chatbot.js'))

        scorm.add_resource(scorm_course, True)
        scorm.set_organization('Smart Study Gmbh')

        os.makedirs(os.path.join(base_directory, 'scorm'))

        scorm.export(os.path.join(base_directory, 'scorm'))

        zipped = shutil.make_archive(os.path.join(base_directory, 'scorm'), 'zip', os.path.join(base_directory, 'scorm'))
        return zipped

class ExportCourseView(RetrieveAPIView):

    def retrieve(self, request, *args, **kwargs):
        zipped = ExportCourseViewHelper.retrieve(self, request, *args, **kwargs)
        return FileResponse(
            open(zipped, 'rb'),
            as_attachment=True,
            content_type='application/force-download',
            status=status.HTTP_200_OK
        )

class TrainCourseView(RetrieveAPIView):

    def retrieve(self, request, *args, **kwargs):

        # e.g. 2023-06-05 19:43:04
        #
        now = datetime.now()
        start_time = now.strftime("%Y-%m-%d %H:%M:%S")

        # e.g. 980a9b9e-d06e-448e-ac38-678200fcf25d
        #
        uuid_str = str(uuid.uuid4())

        # response2 = requests.post(settings.ACTIVE_BOTAPI_URL + "/intent/train", verify=not settings.DEBUG)
        response2 = requests.post(settings.ACTIVE_BOTAPI_URL + "/train/add", json={'uuid': uuid_str, 'start_time': start_time}, verify=not settings.DEBUG)
        response = JsonResponse({'result': 'Success', 'body': response2.json()})
        response.status_code = status.HTTP_200_OK

        return response

class PreviewCourseView(RetrieveAPIView):

    def retrieve(self, request, *args, **kwargs):
        zipped = ExportCourseViewHelper.retrieve(self, request, *args, **kwargs)
        shutil.copyfile(zipped, settings.FILE_SCORMCOURSE)

        docker_client = docker.DockerClient(base_url='unix://var/run/docker.sock')
        container_name = settings.DOCKER_SCORMVIEWER
        my_container = docker_client.containers.get(container_name)
        my_container.restart()

        response = JsonResponse({'result': 'Success'})
        response.status_code = status.HTTP_200_OK
        return response

class CoursePerformance(RetrieveAPIView):
    lookup_url_kwarg = 'courseId'

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def retrieve(self, request, *args, **kwargs):
        course = get_object_or_404(Course.objects, id=self.kwargs[self.lookup_url_kwarg])

        # hotfix: graceful return
        if (course.external_id is None):
            response = HttpResponse(-2)
            response.status_code = status.HTTP_412_PRECONDITION_FAILED
            return response

        # hotfix: graceful return if server is not available
        try:
            api_response = requests.get(settings.ACTIVE_BOTAPI_URL + "/get_course_performance/" + str(course.external_id), timeout=0.5, verify=not settings.DEBUG)
        except:
            response = HttpResponse(-1)
            response.status_code = status.HTTP_200_OK
            return response

        response = HttpResponse(api_response)
        response.status_code = status.HTTP_200_OK
        return response