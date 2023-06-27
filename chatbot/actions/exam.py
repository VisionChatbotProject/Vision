import datetime
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from utils.utils import *
from utils.db import *

# get help for exams
class ExamHelp(Action):
     def name(self) -> Text:
         return "action_exam_help"
     
     def run(self, 
             dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:
         
        options = [
            "Are there any exams?",
            "When is the next exam?",
        ]
        dispatcher.utter_message(text=f"Here are some things you could ask me about exams:\n", buttons=createHelpButtons(options))
        
        return []

# get list of exams for current course
class TaskList(Action):
     def name(self) -> Text:
         return "action_exam_list"
     
     def run(self, 
             dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:
         
        answer = "The exams of this course are \n"
        query = f"SELECT name from exam where id_course='{current_course_id(tracker)}'"
        get_query_results = select_from_database(query,answer)
        dispatcher.utter_message(text=get_query_results)
        return []

# get list of tasks that are active and deadline not passed for this course
class TaskDeadlines(Action):
     def name(self) -> Text:
         return "action_task_deadlines"
     
     def run(self, 
             dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:
       
        query=f"""select id_task, title, description, deadline from task where date(deadline)>=date('now') and active=1 and id_course='{current_course_id(tracker)}' and id_chapter='{current_chapter_id(tracker)}'"""
        cursor.execute(query)
        chapter_resp=""
        for chap in cursor.fetchall():
            chapter_resp+= "\nId of task: "+str(chap[0])+"\n Task: "+chap[1]+ "\n Description: " +chap[2]+ "\n Deadline: "+datetime.strptime(chap[3], '%Y-%m-%d').date().strftime('%d %b %Y')

        dispatcher.utter_message("Yes, you have following tasks \n" + chapter_resp)
        return []

# get next exam
class ExamNext(Action):
     def name(self) -> Text:
         return "action_exam_next"
     
     def run(self, 
             dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:
        
        # query = f"select title, ressources, deadline from task where date(deadline)>=date('now') and active=1 and id_course='{current_course_id(tracker)}' and id_chapter='{current_chapter_id(tracker)}'"
        # cursor.execute(query)
        chapter_resp=""
        # for chap in cursor.fetchall():
        #     chapter_resp+= "\nTask: "+str(chap[0])+"\n  Ressources: " +chap[1]+ "\n Deadline: "+datetime.strptime(chap[2], '%Y-%m-%d').date().strftime('%d %b %Y')
        
        dispatcher.utter_message("The next exam is: \n" + chapter_resp)
        return []