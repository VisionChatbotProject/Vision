# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/core/actions/#custom-actions/


# This is a simple example for a custom action which utters "Hello World!"

from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet, Restarted, AllSlotsReset, UserUtteranceReverted, EventType, FollowupAction, SessionStarted, ActionExecuted
from actions.action_utils import _login_button,_subject_buttons, get_name_phone, log_tracker_event, save_conversation, save_convo, send_email_to_teacher
from utils.helper import *
import utils.SQL_DB_utils as DB


class ShowTopic(Action):
    def name(self) -> Text:
        return "action_show_topic"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        sender = tracker.sender_id
        topic = tracker.get_slot('topic')
        name, phone = get_name_phone(tracker)
        log_tracker_event(tracker, logger)

        logger.info(f"[{sender}] {__file__} :  Inside action_show_topic : name = {name} | subject = {topic} ")
        entry = DB.findOneTopic(tbl="topic", name=topic)
        if entry is not None:
            tell = f"Details of {topic} is as follows : \n {entry}"
        else:
            tell = f"We do not offer {topic}."
        dispatcher.utter_message(text=tell)
        return []


class ActionEndOfFlow(Action):
    def name(self) -> Text:
        return "action_restart"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # name, phone = get_name_phone(tracker)
        logger.info(f"[{tracker.sender_id}] {__file__} | End Of Flow  ")
        log_tracker_event(tracker, logger)
        save_conversation(tracker, logger)
        save_convo(tracker, logger)
        dispatcher.utter_message(text="EOC")
        return [Restarted(), AllSlotsReset()]
        # return []

class ActionMyFallback(Action):
    """Executes the fallback action and goes back to the previous state
    of the dialogue"""

    def name(self) -> Text:
        return "my_default_fallback"

    async def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        # log_tracker_event(tracker, logger)
        count = tracker.get_slot('fallback_count')
        if count is None:
            count = 0
        logger.info(f"[{tracker.sender_id}] {__file__} :  Inside user defined fallback : fallback_count = {count} ")

        if count < 2:
            dispatcher.utter_message(response="utter_please_rephrase")
            count = count + 1
        else:
            dispatcher.utter_message(response="utter_fallback")
            user_email = tracker.get_slot('email')
            teacher_email = tracker.get_slot('teacher_email')
            if teacher_email is not None:
                send_email_to_teacher(tracker,
                                      student_email=user_email,
                                      teacher_email=teacher_email)
            count = 0

        # Revert user message which led to fallback.
        return [UserUtteranceReverted(), SlotSet('fallback_count', count)]


class ActionDefaultFallback(ActionMyFallback):
    """Executes the fallback action and goes back to the previous state
    of the dialogue"""

    def name(self) -> Text:
        return "action_default_fallback"


class MyUnlikelyIntent(ActionMyFallback):
    """Executes the fallback action and goes back to the previous state
    of the dialogue"""

    def name(self) -> Text:
        return "action_unlikely_intent"


class StartOfConversation(Action):
    """
    This class is to called at the end of the quiz. It will show the final core and add the scoe in DB
    """
    def name(self) -> Text:
        return "action_session_start"

    def run(
        self,
        dispatcher,
        tracker: Tracker,
        domain: "DomainDict",
    ) -> List[Dict[Text, Any]]:
        buttons = _login_button()
        buttons = button_it(buttons)
        dispatcher.utter_message(text="To proceed further you need to login first.", buttons=buttons)

        teacher_email = DB.getTeacherEmail()
        quiz_course = None
        # quiz_course = DB.findCourse()
        slots =  [SlotSet('teacher_email', teacher_email), SlotSet('quiz_course', quiz_course)]

        events = []

        # any slots that should be carried over should come after the
        # `session_started` event
        events.extend(slots)

        # an `action_listen` should be added at the end as a user message follows
        # events.append(ActionExecuted("action_login"))

        return events


class Login(Action):
    """
    This class is to called at the end of the quiz. It will show the final core and add the scoe in DB
    """
    def name(self) -> Text:
        return "action_login"

    def run(
        self,
        dispatcher,
        tracker: Tracker,
        domain: "DomainDict",
    ) -> List[Dict[Text, Any]]:
        buttons = _login_button()
        buttons = button_it(buttons)
        dispatcher.utter_message(text="To proceed further you need to login first.", buttons=buttons)
        return []
