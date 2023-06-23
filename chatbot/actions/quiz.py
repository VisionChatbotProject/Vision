from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker, FormValidationAction
from rasa_sdk.types import DomainDict
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet, EventType
from rasa_sdk.forms import FormAction
from utils.utils import *
from utils.db import *

# This form is to launch quiz for a user
class QuizForm(FormAction):
    def name(self) -> Text:
        return "action_quiz_form"
    
    def submit(
            self,
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any],
    ) -> List[Dict]:
        """Define what the form has to do
            after all required slots are filled"""
        # utter submit template
        quiz_course = tracker.get_slot('quiz_course')
        quiz_number = tracker.get_slot('quiz_number')
        quiz_over = tracker.get_slot('quiz_over')
        answer = tracker.get_slot('answer')
        logger.info(f"[{tracker.sender_id}] {__file__} :  Inside quiz_info_form submit function called ")
        logger.info(f"[{tracker.sender_id}] {__file__} :  {quiz_course} {quiz_number} {quiz_over} {answer}")
        # dispatcher.utter_message("Thank you for providing the required information!")
        return []
    
    def run(
        self, 
        dispatcher: CollectingDispatcher, 
        tracker: Tracker, 
        domain: Dict
    ) -> List[EventType]:
        # logger.info(f"[{tracker.sender_id}] {__file__} {inspect.currentframe().f_code.co_name}")
        required_slots = ["quiz_number", "quiz_over"]

        for slot_name in required_slots:
            if tracker.slots.get(slot_name) is None:
                if slot_name == 'quiz_number':
                    tell = "Please enter the quiz number that you want to launch ?"
                    dispatcher.utter_message(text=tell)
                elif slot_name == 'quiz_over':
                    tell = "Please enter the quiz_over that you want to launch ?"
                    dispatcher.utter_message(text=tell)
                return [SlotSet("requested_slot", slot_name)]

            dispatcher.utter_message(text="H: " + str(tracker.slots.get(slot_name)) + " slot_name " + slot_name)

        return [SlotSet("requested_slot", None)]

# This class is to validates the user input given
# class ValidateQuizForm(FormValidationAction):
    
#     def name(self) -> Text:
#         return "validate_quiz_form"

#     # def validate_quiz_course(
#     #     self,
#     #     slot_value: Any,
#     #     dispatcher: CollectingDispatcher,
#     #     tracker: Tracker,
#     #     domain: DomainDict,
#     # ) -> Dict[Text, Any]:
        
#     #     entry = DB.findOne(tbl="course", name=slot_value)
#     #     if entry is not None:
#     #         return {"quiz_course": slot_value}
#     #     else:
#     #         tell = f"We do not offer {slot_value}. Please enter the course again."
#     #         dispatcher.utter_message(text=tell)
#     #         return {"quiz_course": None}

#     def validate_quiz_number(
#         self,
#         slot_value: Any,
#         dispatcher: CollectingDispatcher,
#         tracker: Tracker,
#         domain: DomainDict,
#     ) -> Dict[Text, Any]:
        
#         quiz_course = tracker.get_slot('quiz_course')
#         listofQuiz = DB.getListofQuiz(quiz_course)
        
#         # case when no quiz are present in a course
#         if len(listofQuiz) == 0:
#             dispatcher.utter_message(text=f"No quiz found {slot_value}!")
#             return {"quiz_number": None}

#         # case when quizes are available and user input matches with one of it.
#         elif int(slot_value.strip()) in listofQuiz:
#             quiz_number = int(slot_value.strip())
#             entry = None
#             original_entry = DB.getListofQuizQuestions(quiz_course, quiz_number)
#             if len(original_entry) == 0:
#                 ask = f"Sorry unable to launch the quiz for you for {quiz_course} !!"
#             else:
#                 original_entry, entry = shuffleQuestions(original_entry)
#                 ask = f"List of Questions for quiz for course {quiz_course} is {entry}"

#             return {"quiz_number": slot_value,
#                     'quiz_original_question_list': original_entry,
#                     'quiz_question_list': entry}
        
#         # case when quiz ID doesnt matches with the list
#         else:
#             dispatcher.utter_message(text=f"invalid quiz number {slot_value}!")
#             return {"quiz_number": None}

#     """Validate the answer to the question, show the result correct or incorrect"""
#     def validate_quiz_over(
#         self,
#         slot_value: Any,
#         dispatcher: CollectingDispatcher,
#         tracker: Tracker,
#         domain: DomainDict,
#     ) -> Dict[Text, Any]:

#         original_quiz_question_list = tracker.get_slot('quiz_original_question_list')
        
#         # shuffled list of questions'
#         quiz_question_list = tracker.get_slot('quiz_question_list')
        
#         # get the current question number which is being answered
#         quiz_question_count = tracker.get_slot('quiz_question_count')
#         quiz_over = None
        
#         # counter to track the number of correct answer
#         quiz_correct_ans = tracker.get_slot('quiz_correct_ans')
#         if quiz_correct_ans is None:
#             quiz_correct_ans = 0
#         quiz_correct_ans = int(quiz_correct_ans)
#         email = tracker.get_slot('email')
#         quiz_course = tracker.get_slot('quiz_course')
#         quiz_number = tracker.get_slot('quiz_number')
        
#         # fetch the options for the questions
#         options = quiz_question_list[quiz_question_count][1:][0]
        
#         # get answer string from list of options given to the user
#         user_options = user_answer(slot_value, options)
#         result, correct_answer = DB.checkQuizAns(quiz_course, quiz_number, quiz_question_count+1, user_options, original_quiz_question_list)
#         if result:
#             if email is not None:
#                 dispatcher.utter_message(text="Correct !!")
#                 sqlite_update_query = """UPDATE questions SET user_right_answer = user_right_answer + 1"""
#                 sqlite_insert_query = """INSERT INTO questions (user_email_right_answer, question_text) VALUES ('{email}', '')"""
#                 DB.execute(sqlite_update_query)
#                 DB.execute(sqlite_insert_query)
#                 DB.commit()
#             else:
#                 dispatcher.utter_message(text=f"Register yourself to see the results")
#             quiz_correct_ans = quiz_correct_ans + 1
#         else:
#             if email is not None:
#                 dispatcher.utter_message(text=f"Incorrect !! Correct answer is {correct_answer}")
#                 sqlite_update_query = """UPDATE questions SET user_wrong_answer = user_wrong_answer + 1 """
#                 sqlite_insert_query = """INSERT INTO questions (user_email_wrong_answer, question_text) VALUES ('{email}', '')  """
#                 DB.execute(sqlite_update_query)
#                 DB.execute(sqlite_insert_query)
#                 DB.commit()
#             else:
#                 dispatcher.utter_message(text=f"Register yourself to see the results")

#         # check if we have answered all the questions then store "True" in quiz_over slot else it will has None
#         if int(quiz_question_count) >= len(quiz_question_list)-1:
#             quiz_over = "1"
#         else:
#             quiz_over = None

#         # increment the question number
#         quiz_question_count = quiz_question_count + 1
#         return {"quiz_over": quiz_over, "quiz_question_count": quiz_question_count, 'quiz_correct_ans': quiz_correct_ans}

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
        listofQuiz = getListofQuiz(course_id)
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
        
        # get question number that needs to be asked
        quiz_question_count = tracker.get_slot('quiz_question_count')
        if quiz_question_count is None:
            quiz_question_count = 0
       
        # fetch the question from the list of question
        quiz_question_list = tracker.get_slot('quiz_question_list')
        question = quiz_question_list[quiz_question_count][0]
        
        # fetch the options for the questions
        options = quiz_question_list[quiz_question_count][1:][0]
        dispatcher.utter_message(text=show_question_options(question, options))

        return [SlotSet('quiz_question_count', quiz_question_count)]

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
        
        quiz_number = tracker.get_slot('quiz_number')
        quiz_correct_ans = tracker.get_slot('quiz_correct_ans')
        quiz_question_count = tracker.get_slot('quiz_question_count')
        email = tracker.get_slot('email')
        if email is not None:
            ask = f"Quiz Completed !!\nYour score is {quiz_correct_ans}/{quiz_question_count}"
            dispatcher.utter_message(text=ask)
            score = 100.0*quiz_correct_ans/quiz_question_count
            DB.insertScore(score, quiz_number, email)
        else:
            dispatcher.utter_message(text="Thanks for taking the quiz. Please register yourself to see your score")

        return [SlotSet("quiz_number", None),
                SlotSet('quiz_question_list', None),
                SlotSet('quiz_original_question_list', None),
                SlotSet('quiz_over', None),
                SlotSet('quiz_correct_ans', 0),
                SlotSet('quiz_question_count', 0)]

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