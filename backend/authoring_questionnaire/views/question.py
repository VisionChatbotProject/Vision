from rest_framework.generics import ListCreateAPIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.generics import get_object_or_404

from smartstudy_assets.views import ServeAssetView

from authoring_core.models.organization import Organization
from authoring_core.models.organization import OrganizationMembership

from authoring_questionnaire.models import Questionnaire, Question 
from authoring_course.models import Course

from authoring_questionnaire.serializers import PolymorphicQuestionSerializer

class ListCreateQuestion(ListCreateAPIView):
    serializer_class = PolymorphicQuestionSerializer
    lookup_url_kwarg = 'questionnaireId'
    
    def get_queryset(self):
        questionnaire_id = self.kwargs[self.lookup_url_kwarg]
        return Question.objects.filter(questionnaire_id=questionnaire_id)
    
    def perform_create(self, serializer):           
        person = self.request.user.person
        questionnaire = get_object_or_404(Questionnaire.objects, id=self.kwargs[self.lookup_url_kwarg])
        course = get_object_or_404(Course.objects, id=questionnaire.course.id)
        organization = get_object_or_404(Organization.objects, id=course.organization.id)
        membership = get_object_or_404(OrganizationMembership.objects, person=person, organization_id=organization.id)
        serializer.save(created_by=membership, questionnaire=questionnaire)

class QuestionDetail(RetrieveUpdateDestroyAPIView):
    serializer_class = PolymorphicQuestionSerializer
    lookup_url_kwarg = 'questionId'
    
    def get_queryset(self):        
        qs =  Question.objects.filter(id=self.kwargs[self.lookup_url_kwarg])
        return qs
    
    def perform_update(self, serializer):
        person = self.request.user.person
        questionnaire = get_object_or_404(Question.objects, id=self.kwargs[self.lookup_url_kwarg]).questionnaire
        course = get_object_or_404(Course.objects, id=questionnaire.course.id)
        organization = get_object_or_404(Organization.objects, id=course.organization.id)
        membership = get_object_or_404(OrganizationMembership.objects, person=person, organization_id=organization.id)
        serializer.save(updated_by=membership)

class ServeQuestionImage(ServeAssetView):
    lookup_field = 'pk'
    lookup_url_kwarg='assetPk'
