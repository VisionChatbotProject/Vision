from django.db import transaction

from rest_framework.generics import get_object_or_404
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated

from authoring_intent.models import AbstractIntent
from authoring_intent.serializers import IntentSerializer

from authoring_core.models import Organization
from authoring_core.models import OrganizationMembership
