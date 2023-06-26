import pandas as pd
from logging import getLogger
from datetime import date
import random
from collections import defaultdict
from utils.db import *

logger = getLogger()

def show_question_options(question, options):
    s = question + "\n"
    for idx, item in enumerate(options):
        s = s + f"{str(chr(idx + 97))}. {item}\n"
    return s
  
def generate_quiz(user_id, db_connection):
    conn = db_connection
    c = conn.cursor()

    c.execute('SELECT question_id_right_answer, question_id_wrong_answer FROM users WHERE username = ?', (user_id,))
    result = c.fetchone()
    correct_questions = result[0].split(',') if result[0] else []
    incorrect_questions = result[1].split(',') if result[1] else []

    # exclude the right questions
    c.execute('SELECT question_id FROM questions WHERE question_id NOT IN ({}) ORDER BY RANDOM() LIMIT 8'.format(','.join('?' for _ in correct_questions)), correct_questions)
    question_ids = [row[0] for row in c.fetchall()]

    # choose two questions from wrong questions poll
    if len(incorrect_questions) >= 2:
        incorrect_questions = random.sample(incorrect_questions, 2)
    else:
        incorrect_questions = random.sample(incorrect_questions, len(incorrect_questions))

    # combine ten questions and return
    selected_question_ids = question_ids + incorrect_questions
    random.shuffle(selected_question_ids)
    return ",".join(str(x) for x in selected_question_ids)
  
# This function is for shuffling the dictionary elements.
def shuffleQuestions(q):
  d = []
  for i in q:
    ans = []
    ans = i[1:].copy()
    random.shuffle(ans[0])
    d.append([i[0], ans[0]])

  return q, d

def insertScore(score, quizID, email="abc@xyz.com"):
    """
    insert score in the DB , in score table
    inputs: score, course Name as mentioned in the course table, Id of the quiz taken,
    email id of the student
    """

    dt = date.today()
    sql = f"INSERT INTO scores (quiz_id, username, score, date_of_quiz) VALUES (  {quizID}, '{email}', {score},'{dt}');"
    print(sql)
    try:
        cursor.execute(sql)
        con.commit()
        return cursor.lastrowid
    except Exception as e:
        logger.info(f"{__file__} : Exception = {e}, db_name={db_name}, sql = {sql} ")
        return 0
    
# returns list of quiz ids for a given course
def getListofQuiz(course_id):
 
    sql = f'select quiz_id from quizs where id_course = {course_id}'

    cursor.execute(sql)
    rows = cursor.fetchall()

    ids = []
    for row in rows:
        ids.append(row[0])

    return ids

def getListofQuizQuestions(quiz_course, quiz_number):

    sql = f'SELECT question_text, answer_text FROM quizs, questions, answers WHERE quizs.quiz_id == questions.quiz_id AND       quizs.quiz_id == {quiz_number}  AND  questions.question_id == answers.question_id '
    logger.info(f'{__file__} : Inside getListofQuizQuestions for course = {quiz_course} quizID = {quiz_number}:  sql = {sql}')
    try:
        df = pd.read_sql_query(sql, con)
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
        df = pd.read_sql_query(sql, con)
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


def getScore(email):
    sql = f'select quizs.quiz_name, scores.score, scores.date_of_quiz from scores, quizs where scores.quiz_id==quizs.quiz_id and  scores.username=="{email}" order by scores.date_of_quiz;'
    df = pd.read_sql_query(sql, con)
    if len(df) == 0:
        return "Sorry !! No scores available"
    df.columns = ['Quiz' , 'Score' , 'Date']
    return str(df.to_markdown(index=False))

def findOne(**data):
    record = None
    sql = f'SELECT * from {data.get("tbl")} where name="{data.get("name")}"'
    df = pd.read_sql_query(sql, con)
    record = (df['description'].values[0])
    return record