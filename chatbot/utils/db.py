from functools import lru_cache
import sqlite3
import pandas as pd
import os
from logging import getLogger
from datetime import date
from collections import defaultdict

client = None
cursor = None
db_name = os.environ.get('DATABASE')
logger = getLogger()
@lru_cache(maxsize=512)

def getDB(db_name=os.environ.get('DATABASE')):
    global client
    global cursor
    if client is None:
        client = sqlite3.connect(db_name, check_same_thread=False)
        db = client.cursor()
        cursor = db
    return db

def getCursor():
    global cursor
    return cursor

def closeClient():
    global client

    if client is not None:
        client.close()

def select_from_database(query1,answer1):
    cursor.execute(query1)
    rows = cursor.fetchall()
    if len(list(rows)) < 1:
        return("Sorry I cannot find information about it")
    else:
        for row in rows:
            return (answer1 + ', '.join(row))

def removeAll():
    cursor.patient.remove({})
    cursor.execute('''DELETE FROM Student;''')
    cursor.commit()

def removeOne(mobile_no):
    cursor.execute(f'''DELETE FROM Student where phone={mobile_no};''')
    cursor.commit()
    print('Deleted Entry from DB')

def findAll():
    cursor1 = cursor.execute("SELECT * FROM Student;")
    lst = []
    for record in cursor1:
        lst.append(record)
    return lst

# returns the list of courses offered , in case of exception it will return None
def getListofCourses():
    record = None
    try:
        df = pd.read_sql_query(f'SELECT DISTINCT name from course ', client)
        record = (df['name'].to_list())

    except Exception as e:
        return None

    return record


def getListOfFaqAnswer():
    ' returns the list of topics offered , in case of exception it will return None '
    record = None
    sql = f'select DISTINCT faq_name, faq_answer from faq;'
    logger.info(f'{__file__} : Inside getListOfFaqAnswer :  sql = {sql}')

    try:
        getDB(db_name)
        df = pd.read_sql_query(sql, client)
        df = df[['faq_name', 'faq_answer']]
        D = df.to_dict('list')

    except Exception as e:
        logger.info(f"{__file__} : Exception = {e}, db_name={db_name}, sql = {sql} ")
        return None, None

    return D['faq_name'], D['faq_answer']


def getListOfFaqQuestion():
    ' returns the list of topics offered , in case of exception it will return None '
    record = None
    sql = f'select faq_name, faq_question from faq;'
    logger.info(f'{__file__} : Inside getListOfFaqQuestion :  sql = {sql}')

    try:
        getDB(db_name)
        df = pd.read_sql_query(sql, client)
        df = df[['faq_name', 'faq_question']]
        D = df.to_dict('list')

    except Exception as e:
        logger.info(f"{__file__} : Exception = {e}, db_name={db_name}, sql = {sql} ")
        return None, None

    return D['faq_name'], D['faq_question']


def getListofTopics():
    ' returns the list of topics offered , in case of exception it will return None '
    record = None
    sql = f'SELECT DISTINCT topic from topic'
    logger.info(f'{__file__} : Inside getListofTopics :  sql = {sql}')

    try:
        getDB(db_name)
        df = pd.read_sql_query(sql, client)
        record = (df['topic'].to_list())

    except Exception as e:
        logger.info(f"{__file__} : Exception = {e}, db_name={db_name}, sql = {sql} ")
        return None

    return record


# returns list of quiz ids for a given course
def getListofQuiz(course_id):
    try:
        sql = f'select quiz_id from quizs where id_course = {course_id}'
        logger.info(f"{__file__} : Exception = {e}, db_name={db_name}, sql = {sql} ")
        getDB(db_name)
        df = pd.read_sql_query(sql, client)
        record = (df['quiz_id'].to_list())
    except Exception as e:
        record = []
    return record


def getListofQuizQuestions(quiz_course, quiz_number):

    sql = f'SELECT question_text, answer_text FROM quizs, questions, answers WHERE quizs.quiz_id == questions.quiz_id AND       quizs.quiz_id == {quiz_number}  AND  questions.question_id == answers.question_id '
    logger.info(f'{__file__} : Inside getListofQuizQuestions for course = {quiz_course} quizID = {quiz_number}:  sql = {sql}')
    try:
        getDB(db_name)
        df = pd.read_sql_query(sql, client)
        result = df.to_records(index=False)
        # records below is list of tuples
        records = list(result)

        # convert list of tuples into dictionary  { Q : [ (Ans1, correct) , (Ans2, incorrect)]
        new_records = defaultdict(list)
        for r in records:
            new_records[r[0]].append(r[1])

        # Convert the dictionary to list
        L = [list(t) for t in new_records.items()]
        L.sort()

        logger.info(f'{__file__} : Inside getListofQuizQuestions questions = {L}')

    except Exception as e:
        logger.info(f"{__file__} : Exception = {e}, db_name={db_name}, sql = {sql} ")
        return []
    return L.copy()


def checkQuizAns(quiz_course, quiz_number, quiz_count, user_ans, original_quiz_question_list):
    '''
    Compares the user answer with correct answere stored in the DB
    :param quiz_course:
    :param quiz_number:
    :param quiz_count:
    :param ans:
    :return:  result of comparison  and list of correct answers
    '''
    sql = f'SELECT question_text, answer_text FROM quizs, questions, answers WHERE quizs.quiz_id == questions.quiz_id AND       quizs.quiz_id == {quiz_number}  AND  questions.question_id == answers.question_id AND is_correct == 1 '
    logger.info(f'{__file__} : Inside checkQuizAns for course = {quiz_course} quizID = {quiz_number} quiz_count = {quiz_count}:  sql = {sql}')
    # user_ans = re.split("[\s,]+", ans.lower())
    try:
        getDB(db_name)
        df = pd.read_sql_query(sql, client)
        result = df.to_records(index=False)
        # records below is list of tuples
        records = list(result)

        # convert list of tuples into list of list
        # convert list of tuples into dictionary  { Q : [ (Ans1, correct) , (Ans2, incorrect)]
        new_records = defaultdict(list)
        for r in records:
            new_records[r[0]].append(r[1])

        # Convert the dictionary to list
        L = [list(t) for t in new_records.items()]
        L.sort()

        logger.info(f'{__file__} : Inside checkQuizAns answer from DB = "{L[quiz_count-1][1]}" Vs answer from User = "{user_ans}"')
        correct_ans = [x.lower() for x in L[quiz_count-1][1]]
        if set(user_ans) == set(correct_ans):
            return True, L[quiz_count-1][1]
    except Exception as e:
        logger.info(f"{__file__} : Exception = {e}, db_name={db_name}, sql = {sql} ")

    return False, L[quiz_count-1][1]

def findOneTopic(**data):
    ' returns a single record if found else None'
    record = None
    sql = f'SELECT * from {data.get("tbl")} where UPPER(topic)=UPPER("{data.get("name")}") '
    logger.info(f'{__file__} : Inside findOneTopic :  sql = {sql}')

    try:
        db = getDB(db_name)
        df = pd.read_sql_query(sql, client)
        record = (df['meaning'].values[0])

    except Exception as e:
        logger.info(f"{__file__} : Exception = {e}, db_name={db_name}, sql = {sql} ")
        return None

    return record

def findCourse():
    ' returns a single record if found else None'
    record = None
    sql = f'SELECT name from course'
    logger.info(f'{__file__} : Inside findOneTopic :  sql = {sql}')

    try:
        db = getDB(db_name)
        df = pd.read_sql_query(sql, client)
        record = (df['name'].values[0])

    except Exception as e:
        logger.info(f"{__file__} : Exception = {e}, db_name={db_name}, sql = {sql} ")
        return None

    return record

def findOne(**data):
    ' returns a single record if found else None'
    record = None
    sql = f'SELECT * from {data.get("tbl")} where name="{data.get("name")}"'
    logger.info(f'{__file__} : Inside findOne :  sql = {sql}')
    try:
        db = getDB(db_name)
        df = pd.read_sql_query(sql, client)
        record = (df['description'].values[0])

    except Exception as e:
        logger.info(f"{__file__} : Exception = {e}, db_name={db_name}, sql = {sql} ")
        return None

    return record

def findUser(email):
    ' returns a single record if found else None'
    record = None
    sql = f'SELECT * from users where username="{email}"'
    logger.info(f'{__file__} : Inside findUser :  sql = {sql}')
    try:
        db = getDB(db_name)
        df = pd.read_sql_query(sql, client)
        record = (df['username'].values[0])

    except Exception as e:
        logger.info(f"{__file__} : Exception = {e}, db_name={db_name}, sql = {sql} ")
        return None

    return record

def findUserPwd(email):
    ' returns a single record if found else None'
    record = None
    sql = f'SELECT * from users where username="{email}"'
    logger.info(f'{__file__} : Inside findUserPwd : sql = {sql}')
    try:
        db = getDB(db_name)
        df = pd.read_sql_query(sql, client)
        record = (df['password'].values[0])

    except Exception as e:
        logger.info(f"{__file__} : Exception = {e}, db_name={db_name}, sql = {sql} ")
        return None

    return record

def findReferences(**data):
    course = data.get("course")
    sql = f'''select course.name , module.name, ressources from course INNER JOIN module ON course.id_course=module.id_course and course.name = "{course}";'''
    logger.info(f'{__file__} : Inside findReferences :  sql = {sql}')
    df = pd.read_sql_query(sql, client)
    record = (df['ressources'].to_list())
    return record

def count(tbl):
    db = getDB(db_name)
    cursor = db.execute(f"SELECT * FROM {tbl};")
    return cursor.rowcount

def insertScore(score, quizID, email="abc@xyz.com"):
    """
    insert score in the DB , in score table
    inputs: score, course Name as mentioned in the course table, Id of the quiz taken,
    email id of the student
    """

    dt = date.today()
    sql = f"INSERT INTO scores (quiz_id, username, score, date_of_quiz) VALUES (  {quizID}, '{email}', {score},'{dt}');"
    print(sql)
    logger.info(f'{__file__} : Inside insertScore :  sql = {sql}')
    try:
        db = getDB(db_name)
        db.execute(sql)
        client.commit()
        return db.lastrowid
    except Exception as e:
        logger.info(f"{__file__} : Exception = {e}, db_name={db_name}, sql = {sql} ")
        return 0

def getTeacherEmail():
    sql = f"SELECT email_teacher FROM course ;"
    logger.info(f'{__file__} : Inside getTeacherEmail :  sql = {sql}')

    db = getDB(db_name)
    db.execute(sql)
    entry = db.fetchone()
    email_teacher = entry[0]
    print(f'{__file__} : Inside getTeacherEmail : entry={entry} email_teacher = {email_teacher}')

    return email_teacher

def getScore(email):
    sql = f'select quizs.quiz_name, scores.score, scores.date_of_quiz from scores, quizs where scores.quiz_id==quizs.quiz_id and  scores.username=="{email}" order by scores.date_of_quiz;'
    logger.info(f'{__file__} : Inside getScore :  sql = {sql}')
    try:
        # db = getDB(db_name)
        df = pd.read_sql_query(sql, client)
        if len(df) == 0:
            return "Sorry !! No scores available"
        df.columns = ['Quiz' , 'Score' , 'Date']
        return str(df.to_markdown(index=False))

    except Exception as e:
        print(f"{__file__} : Exception = {e}, db_name={db_name}, sql = {sql} ")
        return "Sorry !! No scores available"

insert_dict = {
    'chapter': "INSERT INTO chapter (name_chapter, short_description, content, key_concepts, ressources, obserrvations) values (?,?,?,?,?,?)",
    'course': "INSERT INTO course (name, teacher, chapters, materials, description, externressources, email_teacher) values (?,?,?,?,?,?,?)",
    'intent': "INSERT INTO intent (intent_name, intent_list, response) values (?,?,?)",
    'task': "INSERT INTO task (title, description, resources, deadline, active) values (?,?,?,?,?)",
    'topic': "INSERT INTO topic (topic, meaning, information) values (?,?,?)",
}

def insert_row(data):
    db = getDB(db_name)
    tbl = data['table']
    print(f"insert_row : {tbl}")
    sql = insert_dict[tbl]

    def tbl_values(data):
        D = {
            'chapter': [data.get('name_chapter'), data.get('short_description'), data.get('content'), data.get('key_concepts'), data.get('ressources'), data.get('obserrvations')],
            'course':  [data.get('name'), data.get('teacher'), data.get('chapters'), data.get('materials'), data.get('description'), data.get('externressources'), data.get('email_teacher')],
            'intent':  [data.get('intent_name'), data.get('intent_list'), data.get('response')],
            'task':    [data.get('title'), data.get('description'), data.get('resources'), data.get('deadline'), data.get('active')],
            'topic':   [data.get('topic'), data.get('meaning'), data.get('information')],
        }
        return D[data['table']]

    val = tbl_values(data)
    print(f"insert_row : {sql} , {val}")
    ret = {}
    try:
        db.execute(sql, val)
        client.commit()
        if db.rowcount == 0:
            ret['description'] = str(f"{db.rowcount} record inserted.")
            ret['status'] = False
        else:
            ret['description'] = str(f"{db.rowcount} record inserted.")
            ret['status'] = True

    except Exception as e:
        ret['description'] = str(e)
        ret['status'] = False
    return ret

update_dict = {
     'chapter': "UPDATE  chapter SET  name_chapter=?, short_description=?, content=?, key_concepts=?, ressources=?, obserrvations=? WHERE id_chapter=?",
     'course':  "UPDATE  course  SET  name=?, teacher=?, chapters=?, materials=?, description=?, externressources=?, email_teacher=? WHERE id_course=?",
     'intent':  "UPDATE  intent  SET  intent_name=?, intent_list=?, response=? WHERE id_indent=?",
     'task':    "UPDATE  task    SET  title=?, description=?, resources=?, deadline=?, active=? WHERE id_task=?",
     'topic':   "UPDATE  topic   SET  topic=?, meaning=?, information=? WHERE id_topic=?",
}


def update_row(data):
    db = getDB(db_name)
    ret = {}
    tbl = data['table']
    sql = update_dict[tbl]

    def tbl_values():
        D = {
            'chapter': [data.get('name_chapter'), data.get('short_description'), data.get('content'), data.get('key_concepts'), data.get('ressources'), data.get('obserrvations')],
            'course':  [data.get('name'), data.get('teacher'), data.get('chapters'), data.get('materials'), data.get('description'), data.get('externressources'), data.get('email_teacher')],
            'intent':  [data.get('intent_name'), data.get('intent_list'), data.get('response')],
            'task':    [data.get('title'), data.get('description'), data.get('resources'), data.get('deadline'), data.get('active')],
            'topic':   [data.get('topic'), data.get('meaning'), data.get('information')],
        }
        return D[data['table']]

    val = tbl_values()
    val.append(data['id'])
    print(f"update_row: {sql}  {val}")
    try:
        db.execute(sql, val)
        client.commit()
        if db.rowcount == 0:
            ret['description'] = str(f"{db.rowcount} record updated.")
            ret['status'] = False
        else:
            ret['description'] = str(f"{db.rowcount} record updated.")
            ret['status'] = True

    except Exception as e:
        ret['description'] = str(e)
        ret['status'] = False
    return ret


delete_dict = {
    'chapter': "DELETE FROM chapter WHERE id_chapter = ?",
    'course': "DELETE FROM course  WHERE id_course = ?",
    'intent': "DELETE FROM intent  WHERE id_intent = ?",
    'task': "DELETE FROM task  WHERE id_task = ?",
    'topic': "DELETE FROM topic  WHERE id_topic = ?",
}


def delete_row(data):
    db = getDB(db_name)
    sql = delete_dict[data['table']]
    id = data['id']
    print(f"delete_row : {sql} , {id}")
    ret = {}
    try:
        db.execute(sql, [id])
        client.commit()
        if db.rowcount == 0:
            ret['description'] = str(f"{db.rowcount} record delete.")
            ret['status'] = False
        else:
            ret['description'] = str(f"{db.rowcount} record delete.")
            ret['status'] = True

    except Exception as e:
        ret['description'] = str(e)
        ret['status'] = False
    return ret


def get_table(**data):
    db = getDB(db_name)
    sql = f"SELECT * FROM {data['table']}"
    logger.info(f'{__file__} : Inside get_table :  sql = {sql}')
    db.execute(sql)
    return db.fetchall()

def get_user(email):
    sql = f"SELECT * FROM user WHERE email LIKE '{email}';"
    logger.info(f'{__file__} : get_user_id:  sql = {sql}')
    db = getDB(db_name)
    db.execute(sql)
    entry = db.fetchone()
    return entry


def create_user(email, name, public_id, password):
    db = getDB(db_name)
    sql = f"INSERT INTO user (name, email, public_id, password) VALUES (?,?,?,?);"
    logger.info(f'{__file__} : create_user:  sql = {sql}')
    val = [name, email, public_id, password]
    print(f"create_user : {sql} {val} ")
    db.execute(sql, val)
    client.commit()
    return db.rowcount != 0

def createSampleDB():
    #Creating a cursor object using the cursor() method
    db = getDB(db_name)

    #Doping EMPLOYEE table if already exists.
    db.execute("DROP TABLE IF EXISTS course")
    db.execute("DROP TABLE IF EXISTS module")
    db.execute("DROP TABLE IF EXISTS assigment")
    db.execute("DROP TABLE IF EXISTS exam")

    #Creating table as per requirement
    sql ='''CREATE TABLE "course" (
	"id_course"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL,
	"teacher"	TEXT NOT NULL,
	"modules"	TEXT,
	"materials"	TEXT,
	"description"	TEXT,
	"externressources"	TEXT,
	PRIMARY KEY("id_course" AUTOINCREMENT));'''
    db.execute(sql)

    sql = '''CREATE TABLE "module" (
	"id_module"	INTEGER NOT NULL UNIQUE,
	"id_course"	INTEGER NOT NULL,
	"name"	TEXT,
	"description"	TEXT,
	"key_concepts"	TEXT,
	"feedback"	TEXT,
	"ressources"	TEXT,
	PRIMARY KEY("id_module" AUTOINCREMENT),
	FOREIGN KEY("id_course") REFERENCES course (id_course));'''
    db.execute(sql)

    sql='''CREATE TABLE "assigment" (
	"id_assigment"	INTEGER NOT NULL UNIQUE,
	"id_module"	INTEGER NOT NULL,
	"titel"	TEXT NOT NULL,
	"description"	TEXT,
	"materials"	BLOB,
	"ressources"	TEXT,
	"deadline"	TEXT NOT NULL,
	FOREIGN KEY("id_module") REFERENCES module (id_module),
	PRIMARY KEY("id_Assigment" AUTOINCREMENT));'''
    db.execute(sql)

    sql='''CREATE TABLE "exam" (
	"id_exam"	INTEGER NOT NULL UNIQUE,
	"id_module"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"description"	TEXT NOT NULL,
	"record"	REAL NOT NULL,
	"observations"	TEXT NOT NULL,
	"date"	TEXT,
	FOREIGN KEY("id_module") REFERENCES module (id_module),
	PRIMARY KEY("id_exam" AUTOINCREMENT));'''

    db.execute(sql)
    sql='''insert into course (name, teacher, description, modules, materials, externressources) values ("Mathematics","Teo teacher","This course is a mathematics example course","Modul 1 - Sum","Book of basics mathematics","http://mathematics.org");'''
    db.execute(sql)
    sql='''insert into course (name, teacher, description, modules, materials, externressources) values ("Language","Language Teacher","This course is an example language course","module 1. Spanish","Book of language","http://language2.com");'''
    db.execute(sql)
    sql='''insert into module (id_course, name, description, key_concepts, feedback, ressources) values (1, "Module 1 Mathematics","Description example 1","Sum Rest","description module 1","http://sum.com https://www.youtube.com/watch?v=7iHJRc0RXP0");'''
    db.execute(sql)
    sql='''insert into module (id_course, name, description, key_concepts, feedback, ressources) values (2,"Module 2 Language","Descripcion exam","sum rest","description module 2","http://rest.com");'''
    db.execute(sql)
    sql='''insert into assigment (id_module, titel, description, materials, ressources, deadline) values (1,"Sum Exercise","Make the following sums","Material1, Material2, Material 3","",date("2022-03-11 00:00:00"));'''
    db.execute(sql)
    sql='''insert into assigment (id_module, titel, description, materials, ressources, deadline) values (2,"language Execerise","translate the following sentences","Lmaterial 1, Lmaterial2, Lmaterial3","",date("2022-03-25 00:00:00"));'''
    db.execute(sql)
    sql='''insert into exam (id_module, name, description, record, observations, date) values (1,"Exam about sum","exam","34","Observations exam 1", date ("2022-03-30 00:00:00"));'''
    db.execute(sql)
    sql='''insert into exam (id_module, name, description, record, observations, date) values (2,"exam about language","exam language","35","observations exam 2", date ("2022-03-23 00:00:00"));'''
    db.execute(sql)
    print("Sample DB created and populated successfully........")
    # Commit your changes in the database
    client.commit()
    entry = count('course')
    print(entry)
    
def current_course(tracker):
    db = getDB(db_name)
    return tracker.get_slot("quiz_course")

def current_course_id(tracker):
    db = getDB(db_name)
    name = tracker.get_slot("quiz_course")
    sql=f"""SELECT id_course from course where name = '{name}'"""
    db.execute(sql)
    entry = db.fetchone()
    logger.info(f'####### {__file__} : {name} {entry}')
    return entry[0]

def current_chapter_id(tracker):
    db = getDB(db_name)
    name = tracker.get_slot("chapter")
    sql=f"""SELECT id_chapter from chapter where name = '{name}'"""
    db.execute(sql)
    entry = db.fetchone()
    logger.info(f'{__file__} : sql = {sql}')
    return entry[0]
