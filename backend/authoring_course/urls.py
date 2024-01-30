"""Authoring Course URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path

from authoring_course.views import *

urlpatterns = [
    path('organizations/<int:orgId>/courses', ListCreateCourse.as_view()),
    path('courses/<int:courseId>', CourseDetail.as_view()),
    path('courses/<int:courseId>/export', ExportCourseView.as_view()),
    path('courses/<int:courseId>/train', TrainCourseView.as_view()),
    path('courses/<int:courseId>/preview', PreviewCourseView.as_view()),
    path('courses/<int:courseId>/performance', CoursePerformance.as_view()),
    path('courses/<int:courseId>/<int:assetPk>', ServeCourseImage.as_view(), name='serve_course_image'),

    path('courses/<int:courseId>/store', ListCreateCourseAsset.as_view()),
    path('courses/<int:courseId>/store/<str:filename>', ServeCourseAsset.as_view(), name='serve_course_asset'),

    path('courses/<int:courseId>/chapters', ListCreateChapter.as_view()),
    path('chapters/<int:chapterId>', ChapterDetail.as_view()),

    path('chapters/<int:chapterId>/slides', ListCreateSlide.as_view()),
    path('chapters/<int:chapterId>/performance', ChapterPerformance.as_view()),

    path('slides/<int:slideId>', SlideDetail.as_view()),
    path('slides/<int:slideId>/content', ServeSlideAsset.as_view(), name='serve_slide_asset'),

    path('courses/<int:courseId>/intents', ListCreateCourseIntent.as_view()),
    path('courseIntents/<int:intentId>', CourseIntentDetail.as_view()),

    path('courses/<int:courseId>/exams', ListCreateCourseExam.as_view()),
    path('courseExams/<int:examId>', CourseExamDetail.as_view()),

    path('courses/<int:courseId>/tasks', ListCreateCourseTask.as_view()),
    path('courseTasks/<int:taskId>', CourseTaskDetail.as_view()),
]