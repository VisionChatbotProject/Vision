from rest_framework.generics import ListCreateAPIView
from rest_framework.generics import get_object_or_404
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from authoring_course.models.course import Course
from authoring_questionnaire.models.questionnaire import Questionnaire
from authoring_questionnaire.serializers import QuestionnaireSerializer

class ListCreateQuestionnaire(ListCreateAPIView):
    serializer_class = QuestionnaireSerializer
    lookup_url_kwarg = 'courseId'

    def get_queryset(self):
       courseId = self.kwargs[self.lookup_url_kwarg]
       return Course.objects.get(id=courseId).questionnaires.all()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['courseId'] = self.kwargs[self.lookup_url_kwarg]
        return context

class QuestionnaireDetail(RetrieveUpdateDestroyAPIView):
    serializer_class = QuestionnaireSerializer
    lookup_url_kwarg = 'questionnaireId'

    def get_queryset(self):
        return Questionnaire.objects.filter(id=self.kwargs[self.lookup_url_kwarg])
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        questionnaire = get_object_or_404(Questionnaire.objects, id=self.kwargs[self.lookup_url_kwarg])
        context['courseId'] = questionnaire.course.id
        return context