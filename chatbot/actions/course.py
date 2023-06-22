from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from utils.utils import *
from utils.db import DB, select_from_database

# get list of courses
class CourseList(Action):
     def name(self) -> Text:
         return "action_course_list"
     
     def run(self, 
             dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:

        query="SELECT name FROM course"
        DB.execute(query)
        results = DB.fetchall()
        course_resp=""
        for cours in results:
            course_resp+= str(cours[0])+ "\n"
             
        dispatcher.utter_message("We have the following courses: \n" + course_resp)
        return []

# get course teacher
class CourseTeacher(Action):
     def name(self) -> Text:
         return "action_course_teacher"
     
     def run(self, 
             dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:         
         
        answer="The lecturer of this course is "
        query=f"SELECT teacher FROM course WHERE name = '{current_course(tracker)}'"
        get_query_results = select_from_database(query,answer)
        dispatcher.utter_message(text= get_query_results)
        return []
      
# get list of chapters for a course
class CourseChapters(Action):
     def name(self) -> Text:
         return "action_course_chapters"
     
     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
         
        answer = "This course contents following chapters \n"
        query = f"SELECT chapters FROM course WHERE name = '{current_course(tracker)}'"
        get_query_results = select_from_database(query,answer)
        dispatcher.utter_message(text=get_query_results)
        return []
      
# get description for course
class CourseDescription(Action):
     def name(self) -> Text:
         return "action_course_description"
     
     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        answer = "Following is the description of the course: \n"
        query = f"SELECT description FROM course WHERE name = '{current_course(tracker)}'"
        get_query_results = select_from_database(query,answer)
        dispatcher.utter_message(text=get_query_results)
        return []

# get course material
class CourseMaterials(Action):
     def name(self) -> Text:
         return "action_course_materials"
     
     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        answer="The materials for this course are: \n"
        query = f"SELECT materials FROM course WHERE name = '{current_course(tracker)}'"
        get_query_results = select_from_database(query,answer)
        dispatcher.utter_message(text= get_query_results)
        return []

# get course ressources      
class CourseExtRessources(Action):
     def name(self) -> Text:
         return "action_course_extressources"
     
     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
         
        answer="The extern ressources for this course are: \n"
        query = f"SELECT externressources FROM course WHERE name = '{current_course(tracker)}'"
        get_query_results = select_from_database(query,answer)
        dispatcher.utter_message(text= get_query_results)
        return []