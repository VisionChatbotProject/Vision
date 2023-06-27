from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from utils.utils import *
from utils.db import *

# get help for chapters
class ChapterHelp(Action):
     def name(self) -> Text:
         return "action_chapter_help"
     
     def run(self, 
             dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:
         
        options = [
            "Show me the content of chapter",
        ]
        dispatcher.utter_message(text=f"Here are some things you could ask me about chapters:\n", buttons=createHelpButtons(options))
        
        return []

# get description of current chapter
class ChapterDescription(Action):
     def name(self) -> Text:
         return "action_chapter_description"
     
     def run(self, 
             dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:

        answer = "Following is the description of the chapter: \n"
        query = f"SELECT short_description FROM chapter WHERE id = '{current_chapter_id(tracker)}'"
        get_query_results = select_from_database(query,answer)
        dispatcher.utter_message(text=get_query_results)
        return []
      
# get content of current chapter
class ChapterContent(Action):
     def name(self) -> Text:
         return "action_chapter_content"
     
     def run(self, 
             dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:
       
        answer="The content of this chapter are \n"
        query=f"""SELECT content from chapter where id='{current_chapter_id(tracker)}'"""
        get_query_results = select_from_database(query,answer)
        dispatcher.utter_message(text= get_query_results)
        return []
    
# get chapter to learn
class ChapterLearn(Action):
     def name(self) -> Text:
         return "action_chapter_learn"
     
     def run(self, 
             dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:
       
        query=f"SELECT content from chapter where id='{current_chapter_id(tracker)}'"
        get_query_results = select_from_database(query,"The content of this chapter are \n")
        dispatcher.utter_message(text=get_query_results)
        return []