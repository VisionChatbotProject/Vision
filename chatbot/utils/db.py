from functools import lru_cache
import sqlite3
import pandas as pd
import os
from logging import getLogger
from datetime import date
from collections import defaultdict

con = None
cursor = None
db_name = os.environ.get('DATABASE') if not None else '/config/bot.db'
logger = getLogger()
@lru_cache(maxsize=512)

def getDB():
    global con
    global cursor
    if con is None:
        con = sqlite3.connect(db_name, check_same_thread=False)
        cursor = con.cursor()
    return cursor

def select_from_database(query1,answer1):
    cursor.execute(query1)
    rows = cursor.fetchall()
    if len(list(rows)) < 1:
        return("Sorry I cannot find information about it")
    else:
        for row in rows:
            return (answer1 + ', '.join(row))

def findUser(email):
    record = None
    sql = f'SELECT * from users where username="{email}"'
    df = pd.read_sql_query(sql, con)
    record = (df['username'].values[0])
    return record

def findUserPwd(email):
    record = None
    sql = f'SELECT * from users where username="{email}"'
    df = pd.read_sql_query(sql, con)
    record = (df['password'].values[0])
    return record

def getTeacherEmail():
    sql = f"SELECT email_teacher FROM course ;"
    cursor.execute(sql)
    entry = cursor.fetchone()
    email_teacher = entry[0]
    print(f'{__file__} : Inside getTeacherEmail : entry={entry} email_teacher = {email_teacher}')

    return email_teacher

def current_course(tracker):
    return tracker.get_slot("quiz_course")

def current_course_id(tracker):
    name = tracker.get_slot("quiz_course")
    logger.info(f' -------- current_course_id {__file__} : course:{name}')
    sql=f"""SELECT id_course from course where name = '{name}'"""
    cursor.execute(sql)
    res = cursor.fetchone()
    logger.info(f' -------- current_course_id {__file__} : course:{name}, course_id:{res[0]}')
    return res[0]

def current_chapter_id(tracker):
    name = tracker.get_slot("chapter")
    sql=f"""SELECT id_chapter from chapter where name_chapter = '{name}'"""
    cursor.execute(sql)
    entry = cursor.fetchone()
    logger.info(f' ******** current_chapter_id {__file__} : sql = {sql}')
    return entry[0]

getDB()