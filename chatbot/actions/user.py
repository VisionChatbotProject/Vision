from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker, FormValidationAction
from rasa_sdk.types import DomainDict
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet, EventType
from utils.utils import *
from utils.db import *

class UserForm(Action):
    """
    Class for the user_details_form form, this form is to take input from the user
    """
    def name(self) -> Text:
        return "user_details_form"

    def run(
        self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict
    ) -> List[EventType]:
        required_slots = ["user_email", "user_pwd", "user_confirmation"]

        for slot_name in required_slots:
            if tracker.slots.get(slot_name) is None:
                # The slot is not filled yet. Request the user to fill this slot next.
                return [SlotSet("requested_slot", slot_name)]

        # All slots are filled.
        return [SlotSet("requested_slot", None)]


class UserEmail(Action):
    """
    This action class is to ask the user to input the course, this action is linked to user_details_form
    """
    def name(self) -> Text:
        return "action_user_email"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        log_tracker_event(tracker)
        dispatcher.utter_message(response="utter_usr_email")
        return []


class UserPwd(Action):
    """
    This action class is to ask the user to input the course, this action is linked to user_details_form
    """
    def name(self) -> Text:
        return "action_user_pwd"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        log_tracker_event(tracker)
        dispatcher.utter_message(response="utter_usr_pwd")
        return []


class UserConfirmation(Action):
    """
    This action class is to ask the user to input the course, this action is linked to user_details_form
    """
    def name(self) -> Text:
        return "action_user_confirmation"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        log_tracker_event(tracker)
        buttons = yes_no_buttons()
        buttons = button_it(buttons)
        dispatcher.utter_message(text="Your credentials are not correct. Do you want to enter again ?", buttons=buttons)
        return []


class UserDetailsForm(FormValidationAction):
    """
    This is a validate action for the form quiz_info_form.
    It validates the user input for quiz_coourse, quiz_number, quiz_over slots
    """
    def name(self) -> Text:
        return "action_user_details_form"

    def validate_user_email(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:

        email = tracker.get_slot('email')
        entry = getDB().findUser(email)
        if entry is not None:
            # dispatcher.utter_message(text="Your user email is a registered email. Welcome !!! ")
            return {"user_email": email}
        else:
            # dispatcher.utter_message(text="Your user email is NOT a registered email. :)  ")
            return {"user_email": "", "user_pwd": ""}

    def validate_user_pwd(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        
        user_email = tracker.get_slot('user_email')
        user_pwd = getDB().findUserPwd(user_email)
        if slot_value == user_pwd:
            # dispatcher.utter_message(text="Welcome !!! ")
            return {"user_pwd": slot_value, "user_confirmation": ""}
        else:
            # dispatcher.utter_message(text="Sorry !! Incorrect user name or password  ")
            return {"user_pwd": ""}


    def validate_user_confirmation(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        intent = tracker.latest_message['intent'].get('name')
        if intent == "affirm":
            dispatcher.utter_message(text="Re-enter your login credentials")
            return {"user_email": None, "user_pwd": None, "user_confirmation": None}
        else:
            dispatcher.utter_message(text="Since you have failed to login. You have restricted access to the college resources.")
            return {"user_email": "", "user_pwd": "", "user_confirmation": ""}


class ActionUserDetailSubmit(Action):
    """
    This action class is called at the end of form, it fetches the detailed description of course from DB
    """
    def name(self) -> Text:
        return "action_user_details_submit"

    def run(
        self,
        dispatcher,
        tracker: Tracker,
        domain: "DomainDict",
    ) -> List[Dict[Text, Any]]:
        log_tracker_event(tracker)
        
        email = tracker.get_slot('user_email')
        if email is None or email == "":
            dispatcher.utter_message(text=f"Welcome Guest!!!")
            email = None
        else:
            dispatcher.utter_message(text=f"Welcome {str(email)}!!!")

        return [SlotSet("email", email), SlotSet("user_email", None), SlotSet("user_pwd", None), SlotSet("user_confirmation", None)]


class UserLogin(Action):
    """
    This class is to called at the end of the quiz. It will show the final core and add the scoe in DB
    """
    def name(self) -> Text:
        return "action_user_login"

    def run(
        self,
        dispatcher,
        tracker: Tracker,
        domain: "DomainDict",
    ) -> List[Dict[Text, Any]]:
        buttons = login_button()
        buttons = button_it(buttons)
        dispatcher.utter_message(text="To proceed further you need to login first.", buttons=buttons)
        return []