from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet, Restarted, AllSlotsReset, UserUtteranceReverted
from utils.utils import *

class ActionEndOfFlow(Action):
    def name(self) -> Text:
        return "action_restart"
    
    def run(self, 
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:

        log_tracker_event(tracker)
        dispatcher.utter_message(text="EOC")
        return [Restarted(), AllSlotsReset()]

# Executes the fallback action and goes back to the previous state of the dialogue
class ActionMyFallback(Action):
    def name(self) -> Text:
        return "action_my_default_fallback"
    
    def run(self,
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        count = tracker.get_slot('fallback_count')
        if count is None:
            count = 0

        if count < 2:
            dispatcher.utter_message(response="utter_please_rephrase")
            count = count + 1
        else:
            dispatcher.utter_message(response="utter_fallback")
            send_email_to_teacher(tracker)
            count = 0

        return [UserUtteranceReverted(), SlotSet('fallback_count', count)]

# Executes the fallback action and goes back to the previous state of the dialogue
class ActionDefaultFallback(ActionMyFallback):
    def name(self) -> Text:
        return "action_default_fallback"


# Executes the fallback action and goes back to the previous state of the dialogue
class MyUnlikelyIntent(ActionMyFallback):
    def name(self) -> Text:
        return "action_unlikely_intent"

class StartOfConversation(Action):

    def name(self) -> Text:
        return "action_session_start"
    
    def run(self,
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text="Welcome I am the Vision chatbot. How can I help you?")
        return []
    
class Help(Action):

    def name(self) -> Text:
        return "action_help"
    
    def run(self,
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text="I can help you with ...")
        return []

# Empty action to set any slot value with REST request
class Query_SetValue(Action):
    def name(self) -> Text:
        return "action_set_value"
    
    def run(self, 
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:
        
        # user = tracker.get_slot("user")
        # dispatcher.utter_message("Setting slot value user to " + str(user))
        # return [SlotSet('user', user)]
        return []