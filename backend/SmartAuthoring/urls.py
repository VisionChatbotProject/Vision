"""SmartAuthoring URL Configuration

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
from django.contrib import admin
from django.urls import path
from django.urls import include
from django.conf import settings
from authoring_user.views.invite_membership import CreateInviteOrganizationMembership

urlpatterns = [
    path('admin/', admin.site.urls),
    path('v1/auth/', include('smartstudy_auth.urls')),
    path('v1/', include('smartstudy_org_core.urls')),
    path('v1/', include('authoring_course.urls')),
    path('v1/', include('authoring_questionnaire.urls')),
    path('v1/', include('authoring_intent.urls')),
    path('v1/', include('authoring_exam.urls')),
    path('v1/', include('authoring_task.urls')),
    path('v1/assets/', include('smartstudy_assets.urls')),
    path('v1/auth/invite/', include('smartstudy_auth.invite_urls')),
    path('v1/invite/<int:orgId>', CreateInviteOrganizationMembership.as_view()),
]

if settings.DEBUG: #pragma: no cover
    from drf_spectacular.views import SpectacularAPIView
    from drf_spectacular.views import SpectacularSwaggerView

    urlpatterns += [
        path('doc/schema/', SpectacularAPIView.as_view(), name='schema'),
        path('doc/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    ]
