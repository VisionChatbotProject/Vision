from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher

import sqlite3

class QueryContent(Action):

     def name(self) -> Text:
         return "query_course_teacher"

     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
         
        database = r"./chatbot.db"
        conn = create_connection(database)
        #slot_value = tracker.get_slot("course_name")
        get_query_results = select_course_teacher(conn)
        dispatcher.utter_message(text= get_query_results)
        return []

def select_course_teacher(conn):
    #query teacher of course
    cur = conn.cursor()
    cur.execute(f"""SELECT teacher FROM course""")

    rows = cur.fetchall()
    if len(list(rows)) < 1:
        return("Sorry I cannot find a lecturer for this course")
    else:
        for row in rows:
            return(f"The lecturer of this course is  {row[0]}.")

def create_connection(db_file):
    """ create a database connection to the SQLite database
        specified by the db_file
    :param db_file: database file
    :return: Connection object or None
    """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)

    return conn
