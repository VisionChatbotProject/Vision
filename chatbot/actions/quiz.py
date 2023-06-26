from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker, FormValidationAction
from rasa_sdk.types import DomainDict
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet, EventType
from utils.utils import *
from utils.db import *
from utils.quiz import *


# This class will ask the user to select the quiz that he/she wants to take for form quiz_info_form
class QuizNumber(Action):

    def name(self) -> Text:
        return "action_ask_quiz_number"
    def run(
        self, 
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:

        course_id = current_course_id(tracker)
        logger.info(f"##### action_ask_quiz_number - course_id: {course_id}")

        listofQuiz = getListofQuiz(course_id)

        logger.info(f"##### action_ask_quiz_number - listofQuiz: {listofQuiz}")

        if len(listofQuiz) == 0:
            ask = f"There is no quiz for course {tracker.get_slot('quiz_course')}"
            dispatcher.utter_message(text=ask)
        else:
            ask = f"Please enter the quiz number from {listofQuiz}"
            ask = f"Please note that your answers must be separated by a coma"
            buttons = quiz_buttons(listofQuiz)
            buttons = button_it(buttons)
            dispatcher.utter_message(text=ask, buttons=buttons)

        return []

# action_ask_<slot>
# This class will ask the quiz question to the user for form quiz_info_form
class QuizOver(Action):
    def name(self) -> Text:
        return "action_ask_quiz_over"

    def run(self, 
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:
        

        def getQuestions(quiz_id):
        
            sql = f'select question_text from questions where quiz_id = {quiz_id} order by question_id'

            cursor.execute(sql)
            rows = cursor.fetchall()

            response = []
            for row in rows:
                response.append(row[0])

            return response

        def getCurrentQuestionIndex():
            quiz_question_count = tracker.get_slot('quiz_question_count')
            if quiz_question_count is None:
                quiz_question_count = 0
            return int(quiz_question_count)
        
        def getCurrentQuestion(questions, currentIndex):
            return questions[currentIndex]

        questions = getQuestions(tracker.get_slot('quiz_number'))
        currentIndex = getCurrentQuestionIndex()
        dispatcher.utter_message(text=f"Question {currentIndex}: {getCurrentQuestion(questions, currentIndex)}")

        return []

# This class is to called at the end of the quiz. It will show the final score and add the scoe in DB
class QuizFormSubmit(Action):
    def name(self) -> Text:
        return "action_quiz_form_submit"
    
    def run(
        self,
        dispatcher,
        tracker: Tracker,
        domain: DomainDict
    ) -> List[Dict[Text, Any]]:
        
        dispatcher.utter_message(text="Thanks for taking the quiz. Please register yourself to see your score")
        

class QuizShowScore(Action):
    def name(self) -> Text:
        return "action_quiz_show_score"
    def run(
        self,
        dispatcher,
        tracker: Tracker,
        domain: DomainDict
    ) -> List[Dict[Text, Any]]:

        email = tracker.get_slot('email')
        if email is not None:
            s = getScore(email)
            dispatcher.utter_message(text=s)
        else:
            dispatcher.utter_message(text="Please login to see your performance")



# This class is to validates the user input given
class ValidateQuizForm(FormValidationAction):
    
    def name(self) -> Text:
        return "validate_quiz_form"

    def validate_quiz_number(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        logger.info(f"validate_quiz_form -  quiz_number: {slot_value}")
        
        # TODO: if number is in list

        return {"quiz_number": slot_value}

    def validate_quiz_over(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        
        def checkSlotAnswer(answer):
            if answer == "a":
                return True
            return False
        
        def getQuestionCount():
            quiz_question_count = tracker.get_slot('quiz_question_count')
            if not quiz_question_count:
                return 0    
            return int(quiz_question_count)
        
        def isQuizOver():
            # Get next question
            if getQuestionCount() < 2:
                return {"quiz_over": None, 'quiz_question_count': str(currentQuestionCount)}
        
            # Quiz is over
            return {"quiz_over": "finished", 'quiz_question_count': str(currentQuestionCount)}
            

        currentQuestionCount = getQuestionCount()
        if checkSlotAnswer(slot_value):
            currentQuestionCount += 1

        logger.info(f"validate_quiz_over -  slot_value: {slot_value} - currentQuestionCount: {currentQuestionCount}")

        return isQuizOver()
