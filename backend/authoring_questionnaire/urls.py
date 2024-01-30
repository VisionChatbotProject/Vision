from django.urls import path

from authoring_course.views import *
from authoring_questionnaire.views import *


urlpatterns = [
    path('courses/<int:courseId>/questionnaires', ListCreateQuestionnaire.as_view()),
    path('questionnaires/<int:questionnaireId>', QuestionnaireDetail.as_view()),
    
    path('questionnaires/<int:questionnaireId>/questions', ListCreateQuestion.as_view()),
    path('questions/<int:questionId>', QuestionDetail.as_view()),
    path('questions/<int:questionId>/<int:assetPk>', ServeQuestionImage.as_view(), name='serve_question_image'),
    
    path('questions/<int:questionId>/answeroptions', ListCreateAnswerOption.as_view()),
    path('answeroptions/<int:answerOptionId>', AnswerOptionDetail.as_view()),
    path('answeroptions/<int:answerOptionId>/<int:assetPk>', ServeAnswerOptionImage.as_view(), name='serve_answer_option_image'),
]

