from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet, Restarted, AllSlotsReset, UserUtteranceReverted
from utils.utils import *
from utils.db import *
import re

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

    def run(self,
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(response="utter_default")
        return []

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
        
        options = [
            "What can I ask you?",
            "I want to take a quiz"
        ]
        dispatcher.utter_message(text=f"Welcome I'm the Visionar. Here is how you could start:\n", buttons=createHelpButtons(options))
        
        return []
    
class Help(Action):

    def name(self) -> Text:
        return "action_help"
    
    def run(self,
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:
        
        def getIntents(courseId):
            cursor.execute(f"select intent_list from intent where id_course = {courseId};")
            rows = cursor.fetchall()
            intents = []
            for row in rows:
                splitted = str(row).split(',-')
                # splitted[0].replace("(?-", "")
                result = re.sub(r"(\(.\-)", "", splitted[0])
                intents.append(result)
            
            return intents
        
        category = tracker.get_slot('help_category')
                    
        if category == 'chapters':
            options = [
                "Show me the content of chapter",
            ]
            
        elif category == 'courses':
            options = [
                "List of all courses?",
                "Who is the teacher?",
                "What are the course chapters?",
                "What is the course content?",
                "What are the course materials?",
                "External ressources for the course?",
            ]

        elif category == 'exams':
            options = [
                "Are there any exams?",
                "When is the next exam?",
            ]
            
        elif category == 'tasks':
            options = [
                "Ressources for task?",
                "Are there deadlines?",
                "What ressources are there for task?"
            ]
            
        elif category == 'quizs':
            options = [
                "take a quiz",
                "show me my score",
            ]

        elif category == 'anything else':
            options1 = [
                "How are you?",
                "Are you a bot?",
                "Restart session",
                "Goodbye"
            ]
            courseId = current_course_id(tracker)
            options2 = getIntents(courseId)
            options = options1 + options2
        else:
        
            options = [
                "What can I ask you about courses?",
                "What can I ask you about chapters?",
                "What can I ask you about tasks?",
                "What can I ask you about exams?",
                "What can I ask you about quizs?",
                "What can I ask you about anything else?",
            ]
            
        dispatcher.utter_message(text=f"Here are some things you could ask me:\n", buttons=createHelpButtons(options))
        
        return [SlotSet('help_category', None)]
    
class ActionsHelp(Action):

    def name(self) -> Text:
        return "action_actions_help"
    
    def run(self,
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:
                
        def getIntents(courseId):
            cursor.execute(f"select intent_list from intent where id_course = {courseId};")
            rows = cursor.fetchall()
            intents = []
            for row in rows:
                splitted = str(row).split(',-')
                # splitted[0].replace("(?-", "")
                result = re.sub(r"(\(.\-)", "", splitted[0])
                intents.append(result)
            
            return intents
        
        options = [
            "How are you?",
            "Are you a bot?",
            "Restart session",
            "Goodbye"
        ]
        courseId = current_course_id(tracker)
        intents = getIntents(courseId)
        dispatcher.utter_message(text=f"Here are some things you could ask me:\n", buttons=createHelpButtons(options + intents))
        
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
        return []