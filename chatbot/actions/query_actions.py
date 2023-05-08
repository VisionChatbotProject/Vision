from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
import sqlite3
from sqlite3 import Error
from datetime import datetime
from rasa_sdk.events import AllSlotsReset
from re import search
import string
import colorama
from colorama import Fore

import os
database = os.environ.get('DATABASE')

class Query_Lecturer_Course(Action):
     def name(self) -> Text:
         return "query_course_teacher"
     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        answer="The lecturer of this course is "
        query="SELECT teacher FROM course"
        get_query_results = select_from_database(query,answer)
        dispatcher.utter_message(text= get_query_results)
        return []

class Query_List_Course(Action):
     def name(self) -> Text:
         return "query_list_course"
     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        conn = create_connection(database)
        cur = conn.cursor()
        query="SELECT name FROM course"
        cur.execute (query)
        results=cur.fetchall()
        response="We have the following courses: \n"
        course_resp=""
        for cours in results:
            course_resp+= str(cours[0])+ "\n"
             
        text1 = response+course_resp
        text2 ="Do you want to make a quiz?"
        dispatcher.utter_message(text1)
        dispatcher.utter_message(text2)
        return []

class Query_Chapters_Course(Action):
     def name(self) -> Text:
         return "query_course_chapters"
     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
             answer="This course contents following chapters \n"
             query="SELECT chapters FROM course"
             get_query_results = select_from_database(query,answer)
             dispatcher.utter_message(text= get_query_results)
             return []

class Query_Description_Course(Action):
     def name(self) -> Text:
         return "query_course_description"
     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        answer="Following is the description of the course: \n"
        query="SELECT description FROM course"
        get_query_results = select_from_database(query,answer)
        dispatcher.utter_message(text= get_query_results)
        return []

class Query_Materials_Course(Action):
     def name(self) -> Text:
         return "query_course_materials"
     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        answer="The materials for this course are: \n"
        query="SELECT materials from course"
        get_query_results = select_from_database(query,answer)
        dispatcher.utter_message(text= get_query_results)
        return []

class Query_ExtRessources_Course(Action):
     def name(self) -> Text:
         return "query_course_extressources"
     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        answer="The extern ressources for this course are: \n"
        query="SELECT externressources from course;"
        get_query_results = select_from_database(query,answer)
        dispatcher.utter_message(text= get_query_results)
        return []

class Query_ListChapter(Action):
     def name(self) -> Text:
         return "query_list_chapter"
     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        conn = create_connection(database)
        cur = conn.cursor()
        query="SELECT id_chapter, name_chapter from chapter;"
        cur.execute (query)
        results=cur.fetchall()
        response = "Choose from which chapter you need the description \n"
        chapter_resp=""
        for chap in results:
            chapter_resp+= str(chap[0])+"\t"+chap[1]+ "\n"
        final_response=response+chapter_resp
        dispatcher.utter_message(final_response)
        return []


# module_task
class Query_Tasks_of_Module(Action):
     def name(self) -> Text:
         return "query_tasks_of_module"
     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
         modu=tracker.get_slot("module")
         answer="The task of this module are \n"
         query=f"""SELECT  """
         

## New
class Query_Content_Chapter_From_Course(Action):
     def name(self) -> Text:
         return "query_content_chapter_from_course"
     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        chapt=tracker.get_slot("chapter")
        cours=tracker.get_slot("course")
        answer="The content of this chapter are \n"
        query=f"""SELECT content from chapter where id_course='{chapt}'and chapter.id_course=id_course"""
        get_query_results = select_from_database(query,answer)
        dispatcher.utter_message(text= get_query_results)
        return []

## Chapter queries
class Query_Description_Chapter(Action):
     def name(self) -> Text:
         return "query_description_chapter"
     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        chapt=tracker.get_slot("chapter")
        answer="\n"
        query=f"""SELECT short_description from chapter where id_chapter='{chapt}'"""
        get_query_results = select_from_database(query,answer)
        dispatcher.utter_message(text= get_query_results)
        return []

#class Query_Content_Chapter(Action):
#     def name(self) -> Text:
#         return "query_content_chapter"
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#        chapt=tracker.get_slot("chapter")
#        answer="The content of this chapter are \n"
#        query=f"""SELECT content from chapter where id_chapter='{chapt}'"""
#        get_query_results = select_from_database(query,answer)
#        dispatcher.utter_message(text= get_query_results)
#        return []

class Query_Key_Concepts_Chapter(Action):
     def name(self) -> Text:
         return "query_key_concepts_chapter"
     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        chapt=tracker.get_slot("chapter")
        answer="The key concepts for this chapters is\n"
        query=f"""SELECT key_concepts from chapter where id_chapter='{chapt}'"""
        get_query_results = select_from_database(query,answer)
        dispatcher.utter_message(text= get_query_results)
        return []

class Query_Ressources_Chapter(Action):
     def name(self) -> Text:
         return "query_ressources_chapter"
     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        chapt=tracker.get_slot("chapter")
        answer="Following are the ressources for this chapter\n"
        query=f"""SELECT ressources from chapter where id_chapter='{chapt}'"""
        get_query_results = select_from_database(query,answer)
        dispatcher.utter_message(text= get_query_results)
        return []

class Query_Observations_Chapter(Action):
     def name(self) -> Text:
         return "query_observations_chapter"
     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        chapt=tracker.get_slot("chapter")
        answer="Addiotional information for this chapter\n"
        query=f"""SELECT observations from chapter where id_chapter='{chapt}'"""
        get_query_results = select_from_database(query,answer)
        dispatcher.utter_message(text= get_query_results)
        return []

class Query_Titel_Task(Action):
     def name(self) -> Text:
         return "query_title_task"
     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        conn = create_connection(database)
        cur = conn.cursor()
        query="select id_task, title, description, deadline from task where date(deadline)>=date('now') and active=1;"
        cur.execute (query)
        results=cur.fetchall()
        response = "Yes, you have following tasks \n"
        chapter_resp=""
        for chap in results:
            chapter_resp+= "\nId of task: "+str(chap[0])+"\n Task: "+chap[1]+ "\n Description: " +chap[2]+ "\n Deadline: "+datetime.strptime(chap[3], '%Y-%m-%d').date().strftime('%d %b %Y')
        final_response=response+chapter_resp
        dispatcher.utter_message(final_response)
        return []




class Query_Exam_Deadline(Action):
     def name(self) -> Text:
         return "query_title_task"
     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
             conn = create_connection(database)
             cur = conn.cursor()
             query="select id_exam, name, description, date from exam where date(date)>=date('now') and active=1;"
             cur.execute (query)
             results=cur.fetchall()
             response = "You have following exams \n"
             exam_resp=""
             for exa in results:
                 exam_resp+= "\nId of exam: "+str(exa[0])+"\n Exam: "+exa[1]+ "\n Description: " +chap[2]+ "\n Deadline: "+datetime.strptime(chap[3], '%Y-%m-%d').date().strftime('%d %b %Y')
             final_response=response+chapter_resp
             dispatcher.utter_message(final_response)
             return []










class Query_Ressources_Task(Action):
     def name(self) -> Text:
         return "query_ressources_task"
     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        conn = create_connection(database)
        cur = conn.cursor()
        query="select title, ressources, deadline from task where date(deadline)>=date('now') and active=1;"
        cur.execute (query)
        results=cur.fetchall()
        response = "Following ressources for the tasks: \n"
        chapter_resp=""
        for chap in results:
            chapter_resp+= "\nTask: "+str(chap[0])+"\n  Ressources: " +chap[1]+ "\n Deadline: "+datetime.strptime(chap[2], '%Y-%m-%d').date().strftime('%d %b %Y')
        final_response=response+chapter_resp
        dispatcher.utter_message(final_response)
        return []

class Query_TopicMeaning(Action):
     def name(self) -> Text:
         return "query_topic_meaning"
     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        conn = create_connection(database)
        cur = conn.cursor()
        val=tracker.latest_message.get("text")
        tpc=buscar(" ".join(val.lower().split()).translate(str.maketrans('', '', string.punctuation)))
        if tpc==0: 
            dispatcher.utter_message(text="Sorry I don't understand your")
        #tpc=tracker.get_slot("topic")
        else: 
            query=f"""SELECT * from topic where topic like '%{tpc}%'"""
            cur.execute (query)
            results=cur.fetchall()
            topic_resp=""
            if len(list(results)) < 1:
                response = "Sorry I cannot find any definition for your topic"
            else:
                response = "Following definitions are for the topic:\n"
                for top in results:
                    topic_resp+= str(top[0])+". Topic - "+top[1]+": "+top[2]+ "\n\n"
            final_response=response+topic_resp
            dispatcher.utter_message(text=final_response)
        return [AllSlotsReset()]

class Query_SetValue(Action):
     def name(self) -> Text:
         return "query_set_value"
     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        user = tracker.get_slot("user")
        dispatcher.utter_message("Setting slot value user to " + str(user))
        return [SlotSet('user', user)]

def buscar(mystring):
    if (search("what does",mystring) and search("mean",mystring)) or search("meaning of",mystring) or search("definition of",mystring):
        if search("what does",mystring) and search("mean",mystring): 
            return mystring.partition("what does ")[2].partition(" mean")[0]
        if search("meaning of",mystring): 
            return (mystring.partition("meaning of ")[2])
        if search("definition of",mystring):
            return (mystring.partition("definition of ")[2])
    else:
        return 0

def select_from_database(query1,answer1):
    #query teacher of course
    conn = create_connection(database)
    cur = conn.cursor()
    cur.execute(query1)
    rows = cur.fetchall()
    if len(list(rows)) < 1:
        return("Sorry I cannot find information about it")
    else:
        for row in rows:
            return (answer1 + ', '.join(row))

def create_connection(db_file):
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)
    return conn
