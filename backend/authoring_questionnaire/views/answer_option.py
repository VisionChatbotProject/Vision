from rest_framework.generics import ListCreateAPIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.generics import get_object_or_404

from smartstudy_assets.views import ServeAssetView
from authoring_questionnaire.models import Question, AnswerOption

from authoring_core.models.organization import OrganizationMembership
from authoring_questionnaire.serializers.answer_option import AnswerOptionPolymorphicSerializer

class ListCreateAnswerOption(ListCreateAPIView):
    serializer_class = AnswerOptionPolymorphicSerializer
    lookup_url_kwarg = 'questionId'
    
    def get_queryset(self):
        question_id = self.kwargs[self.lookup_url_kwarg]
        return AnswerOption.objects.filter(question_id=question_id)
    
    def perform_create(self, serializer):
        question = get_object_or_404(Question.objects, id=self.kwargs[self.lookup_url_kwarg])
        m = get_object_or_404(OrganizationMembership, person=self.request.user.person, organization=question.questionnaire.course.organization.id)
        serializer.save(created_by=m, question=question)

class AnswerOptionDetail(RetrieveUpdateDestroyAPIView):
    serializer_class = AnswerOptionPolymorphicSerializer
    lookup_url_kwarg = 'answerOptionId'

    def get_queryset(self):
        return AnswerOption.objects.filter(id=self.kwargs[self.lookup_url_kwarg])
    
    def perform_update(self, serializer):
        question = get_object_or_404(AnswerOption.objects, id=self.kwargs[self.lookup_url_kwarg]).question
        m = get_object_or_404(OrganizationMembership, person=self.request.user.person, organization=question.questionnaire.course.organization.id)
        serializer.save(updated_by=m, question=question)

class ServeAnswerOptionImage(ServeAssetView):
    lookup_field = 'pk'
    lookup_url_kwarg='assetPk'
