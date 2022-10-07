# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/core/actions/#custom-actions/


# This is a simple example for a custom action which utters "Hello World!"

from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker, FormValidationAction
from rasa_sdk.types import DomainDict
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet, FollowupAction, AllSlotsReset, UserUtteranceReverted, EventType, ActiveLoop
from actions.action_utils import _subject_buttons, _quiz_buttons, _show_question_options, _user_answer, _yes_no_buttons, save_conversation, save_convo
from utils.helper import *
import utils.SQL_DB_utils as DB


class QuizInfoForm(Action):
    """
    This form is to launch quiz for a user
        - this form has 3 slots
            - quiz_course
            - quiz_number
            - quiz_over
        - action_ask_quiz_course: This action class will ask user to select a course
        - action_ask_quiz_number: This action class will ask user to which quiz he wants to go for the selected course
        - action_ask_quiz_over: This action class will iterate over all the questions in the quiz
        - validate_quiz_info_form : This class is to vlidates the user input given
        - action_quiz_info_submit : This class will called at the end of quiz. It will show the final score ot the user.
                                    And make an entry of the score in the DB
    """
    def name(self) -> Text:
        return "quiz_info_form"

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
            logger.info(f"[{tracker.sender_id}] {__file__} :  Inside quiz_info_form submit function called ")
            logger.info(f"[{tracker.sender_id}] {__file__} :  {quiz_course} {quiz_number} {quiz_over} ")

            return []

    def run(
        self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict
    ) -> List[EventType]:
        required_slots = ["quiz_course", "quiz_number", "quiz_over"]
        logger.info(f"[{tracker.sender_id}] {__file__} :  Inside quiz_info_form  ")

        for slot_name in required_slots:
            logger.info(f"[{tracker.sender_id}] {__file__} :  Inside quiz_info_form | slot_name : {slot_name} ")

            if tracker.slots.get(slot_name) is not None:
                # The slot is not filled yet. Request the user to fill this slot next.
                if slot_name == 'quiz_course':
                    tell = "Please enter the name of the course for which you want to have the quiz ?"
                    dispatcher.utter_message(text=tell)
                elif slot_name == 'quiz_number':
                    tell = "Please enter the quiz number that you want to launch ?"
                    dispatcher.utter_message(text=tell)
                elif slot_name == 'quiz_over':
                    tell = "Please enter the quiz number that you want to launch ?"
                    dispatcher.utter_message(text=tell)
                return [SlotSet("requested_slot", slot_name)]

        # All slots are filled.
        return [SlotSet("requested_slot", None)]


class ValidateQuizInfoForm(FormValidationAction):
    """
    This is a validate action for the form quiz_info_form.
    It validates the user input for quiz_coourse, quiz_number, quiz_over slots
    """
    def name(self) -> Text:
        return "validate_quiz_info_form"

    def validate_quiz_course(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """
        Validate function for slot quiz_course
        :param slot_value:
        :param dispatcher:
        :param tracker:
        :param domain:
        :return:
        """
        logger.info(f"[{tracker.sender_id}] {__file__} :  Inside validate_quiz_course | quiz_course : {slot_value} ")

        entry = DB.findOne(tbl="course", name=slot_value)
        if entry is not None:
            return {"quiz_course": slot_value}
        else:
            tell = f"We do not offer {slot_value}. Please enter the course again."
            dispatcher.utter_message(text=tell)
            return {"quiz_course": None}

    def validate_quiz_number(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """
        Validate function for the quiz number
        :param slot_value:
        :param dispatcher:
        :param tracker:
        :param domain:
        :return:
        """
        quiz_course = tracker.get_slot('quiz_course')
        listofQuiz = DB.getListofQuiz(quiz_course)
        logger.info(f"[{tracker.sender_id}] {__file__} :  Inside validate_quiz_number | quiz_course : {quiz_course} | quiz_number : {slot_value} | list : {listofQuiz}")
        if len(listofQuiz) == 0:
            """ case when no quiz are present in a course, In this case bot will ask for another course to enter """
            logger.info(f"[{tracker.sender_id}] : No QUIZ found !! ")
            ask = f"No QUIZ found {slot_value} !!"
            dispatcher.utter_message(text=ask)
            return {"quiz_number": None, 'quiz_course': None}

        elif int(slot_value.strip()) in listofQuiz:
            """ case when quizes are available and user input matches with one of it. """
            logger.info(f"[{tracker.sender_id}] : VALID QUIZ number !! ")
            quiz_number = int(slot_value.strip())
            # case when we have a valid quiz ID
            entry = None
            original_entry = DB.getListofQuizQuestions(quiz_course, quiz_number)
            if len(original_entry) == 0:
                ask = f"Sorry unable to launch the quiz for you for {quiz_course} !!"
            else:
                logger.info(f"[{tracker.sender_id}] {__file__} :BEFORE: {original_entry}")
                original_entry, entry = shuffleQuestions(original_entry)
                logger.info(f"[{tracker.sender_id}] {__file__} :AFTER: {original_entry}")

                ask = f"List of Questions for quiz for course {quiz_course} is {entry}"
                logger.info(f"[{tracker.sender_id}] {__file__} : {ask}")

            # dispatcher.utter_message(text=ask)

            return {"quiz_number": slot_value,
                    'quiz_original_question_list': original_entry,
                    'quiz_question_list': entry}
        else:
            """ case when quiz ID doesnt matches with the list """
            logger.info(f"[{tracker.sender_id}] : INVALID QUIZ number !! ")
            ask = f"INVALID QUIZ number {slot_value} !!"
            dispatcher.utter_message(text=ask)
            return {"quiz_number": None}


    def validate_quiz_over(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate the answer to the question, show the result correct or incorrect"""
        logger.info(f"[{tracker.sender_id}] {__file__} :  Inside validate_quiz_over | user answer : {slot_value} ")

        # original list of questions'
        original_quiz_question_list = tracker.get_slot('quiz_original_question_list')
        # shuffled list of questions'
        quiz_question_list = tracker.get_slot('quiz_question_list')
        # get the current question number which is being answered
        quiz_question_count = tracker.get_slot('quiz_question_count')
        quiz_over = None
        # counter to track the number of correct answer
        quiz_correct_ans = tracker.get_slot('quiz_correct_ans')
        if quiz_correct_ans is None:
            quiz_correct_ans = 0
        quiz_correct_ans = int(quiz_correct_ans)
        email = tracker.get_slot('email')
        quiz_course = tracker.get_slot('quiz_course')
        quiz_number = tracker.get_slot('quiz_number')
        # fetch the options for the questions
        options = quiz_question_list[quiz_question_count][1:][0]
        # get answer string from list of options given to the user
        user_options = _user_answer(slot_value, options)
        result, correct_answer = DB.checkQuizAns(quiz_course, quiz_number, quiz_question_count+1, user_options, original_quiz_question_list)
        if result:
            if email is not None:
                dispatcher.utter_message(text="Correct !!")
            else:
                dispatcher.utter_message(text=f"Register yourself to see the results")
            quiz_correct_ans = quiz_correct_ans + 1
        else:
            if email is not None:
                dispatcher.utter_message(text=f"Incorrect !! Correct answer is {correct_answer}")
            else:
                dispatcher.utter_message(text=f"Register yourself to see the results")

        # check if we have answered all the questions then store "True" in quiz_over slot else it will has None
        if int(quiz_question_count) >= len(quiz_question_list)-1:
            quiz_over = "1"
            logger.info(f"[{tracker.sender_id}] {__file__} :  Inside validate_quiz_over | QUIZ OVER !! ")
        else:
            logger.info(f"[{tracker.sender_id}] {__file__} :  Inside validate_quiz_over | QUIZ Continues !! ")
            quiz_over = None

        # increment the question number
        quiz_question_count = quiz_question_count + 1
        return {"quiz_over": quiz_over, "quiz_question_count": quiz_question_count, 'quiz_correct_ans': quiz_correct_ans}



class AskQuizCourse(Action):
    """
    This action class will ask user to select a course for the quiz_info_form
    """
    def name(self) -> Text:
        return "action_ask_quiz_course"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        sender = tracker.sender_id
        logger.info(f"[{sender}] {__file__} :  Inside action_ask_quiz_course  ")
        # log_tracker_event(tracker, logger)

        course_list = DB.getListofCourses()
        if course_list is not None:
            ask = "Below are the courses that we have. Please select the course for the quiz"
            buttons = _subject_buttons(course_list)
            buttons = button_it(buttons)
            dispatcher.utter_message(text=ask, buttons=buttons)
        else:
            dispatcher.utter_message(text="Some issue is display list of courses, Please try again after some time")
        return []


class AskQuizNumber(Action):
    """
    This class will ask the user to select the quiz that he/she wants to take for form quiz_info_form
    """
    def name(self) -> Text:
        return "action_ask_quiz_number"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        quiz_course = tracker.get_slot('quiz_course')
        sender = tracker.sender_id
        logger.info(f"[{sender}] {__file__} : Inside action_ask_quiz_number")
        listofQuiz = DB.getListofQuiz(quiz_course)
        if len(listofQuiz) == 0:
            ask = f"There is no quiz for course {quiz_course}. Enter any number to continue"
            dispatcher.utter_message(text=ask)
        else:
            ask = f"Please enter the quiz number from {listofQuiz}"
            buttons = _quiz_buttons(listofQuiz)
            buttons = button_it(buttons)
            dispatcher.utter_message(text=ask, buttons=buttons)
        return []


# class QuizLaunchForm(Action):
#     def name(self) -> Text:
#         return "quiz_launch_form"
#
#     def run(
#         self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict
#     ) -> List[EventType]:
#         required_slots = ["quiz_over"]
#         logger.info(f"[{tracker.sender_id}] {__file__} :  Inside quiz_launch_form  ")
#
#         for slot_name in required_slots:
#             if tracker.slots.get(slot_name) is None:
#                 # The slot is not filled yet. Request the user to fill this slot next.
#
#                 return [SlotSet("requested_slot", slot_name)]
#
#         # All slots are filled.
#         return [SlotSet("requested_slot", None)]
#
#
# class QuizLaunchSubmit(Action):
#     def name(self) -> Text:
#         return "action_quiz_launch_submit"
#
#     def run(
#         self,
#         dispatcher,
#         tracker: Tracker,
#         domain: "DomainDict",
#     ) -> List[Dict[Text, Any]]:
#         quiz_course = tracker.get_slot('quiz_course')
#         quiz_number = tracker.get_slot('quiz_number')
#
#         logger.info(f"[{tracker.sender_id}] {__file__} :  Inside action_quiz_launch_submit : quiz_course = {quiz_course}  | quiz_number = {quiz_number} ")
#         dispatcher.utter_message(text="Your score is 0")
#
#         return [SlotSet("quiz_course", None),
#                 SlotSet("quiz_number", None),
#                 SlotSet('quiz_question_list', None),
#                 SlotSet('quiz_original_question_list', None),
#                 SlotSet('quiz_launch', False)]


class AskQuizOver(Action):
    """ This class will ask the quiz question to the user for form quiz_info_form """
    def name(self) -> Text:
        return "action_ask_quiz_over"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # get the list of questions to be asked
        quiz_question_list = tracker.get_slot('quiz_question_list')
        # get question number that needs to be asked
        quiz_question_count = tracker.get_slot('quiz_question_count')
        if quiz_question_count is None:
            quiz_question_count = 0

        sender = tracker.sender_id
        # fetch the question from the list of question
        question = quiz_question_list[quiz_question_count][0]
        # fetch the options for the questions
        options = quiz_question_list[quiz_question_count][1:][0]
        logger.info(f"[{sender}] {__file__} : Inside action_ask_quiz_over |  question : {question} |  options : {options}")

        # buttons = _subject_buttons(options)
        # buttons = button_it(buttons)
        dispatcher.utter_message(text=_show_question_options(question, options))

        return [SlotSet('quiz_question_count', quiz_question_count)]

#
# class ValidateQuizLaunchForm(FormValidationAction):
#     def name(self) -> Text:
#         return "validate_quiz_launch_form"
#
#     def validate_quiz_over(
#         self,
#         slot_value: Any,
#         dispatcher: CollectingDispatcher,
#         tracker: Tracker,
#         domain: DomainDict,
#     ) -> Dict[Text, Any]:
#         """Validate `first_name` value."""
#         logger.info(f"[{tracker.sender_id}] {__file__} :  Inside validate_quiz_launch_form | user answer : {slot_value} ")
#
#         original_quiz_question_list = tracker.get_slot('quiz_original_question_list')
#         quiz_question_list = tracker.get_slot('quiz_question_list')
#         quiz_question_count = tracker.get_slot('quiz_question_count')
#         quiz_over = None
#         if original_quiz_question_list[quiz_question_count][1] == slot_value:
#             dispatcher.utter_message(text="Correct !!")
#         else:
#             dispatcher.utter_message(text=f"Incorrect !! Correct answer is {original_quiz_question_list[quiz_question_count][1]}")
#
#         if int(quiz_question_count) >= len(quiz_question_list)-1:
#             dispatcher.utter_message(text="Quiz Completed !!")
#             quiz_over = "True"
#
#         quiz_question_count = quiz_question_count + 1
#         return {"quiz_over": quiz_over, "quiz_question_count": quiz_question_count}


class QuizInfoSubmit(Action):
    """
    This class is to called at the end of the quiz. It will show the final core and add the scoe in DB
    """
    def name(self) -> Text:
        return "action_quiz_info_submit"

    def run(
        self,
        dispatcher,
        tracker: Tracker,
        domain: "DomainDict",
    ) -> List[Dict[Text, Any]]:
        quiz_course = tracker.get_slot('quiz_course')
        quiz_number = tracker.get_slot('quiz_number')
        quiz_correct_ans = tracker.get_slot('quiz_correct_ans')
        quiz_question_count = tracker.get_slot('quiz_question_count')

        logger.info(f"[{tracker.sender_id}] {__file__} :  Inside action_quiz_info_submit : quiz_course = {quiz_course}  | quiz_number = {quiz_number}  |  quiz_correct_ans = {quiz_correct_ans}")
        ask = "Quiz Completed !!"

        try:
            email = tracker.get_slot('email')
            if email is not None:
                ask = ask + f"\nYour score is {quiz_correct_ans}/{quiz_question_count}"
                dispatcher.utter_message(text=ask)
                score = 100.0*quiz_correct_ans/quiz_question_count
                DB.insertScore(score, quiz_number, email)
            else:
                dispatcher.utter_message(text="Thanks for taking the quiz. Please register yourself to see your score")

        except Exception as e:
            logger.info(f"[{tracker.sender_id}] {__file__} :  Inside action_quiz_info_submit : issue in updating the score in DB , reason {e} ")

        return [SlotSet("quiz_number", None),
                SlotSet('quiz_question_list', None),
                SlotSet('quiz_original_question_list', None),
                SlotSet('quiz_over', None),
                SlotSet('quiz_correct_ans', 0),
                SlotSet('quiz_question_count', 0)]


class ShowUSerScore(Action):
    def name(self) -> Text:
        return "action_show_score"

    def run(
        self,
        dispatcher,
        tracker: Tracker,
        domain: "DomainDict",
    ) -> List[Dict[Text, Any]]:

        email = tracker.get_slot('email')
        if email is not None:
            logger.info(f"[{tracker.sender_id}] {__file__} :  Inside action_show_score : email id is  {email} ")
            s = DB.getScore(email)
            dispatcher.utter_message(text=s)
        else:
            dispatcher.utter_message(text="Please register yourself to see your performance")



