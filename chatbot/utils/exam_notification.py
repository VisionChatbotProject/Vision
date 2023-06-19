from functools import lru_cache
import sqlite3
import os
from datetime import datetime, timedelta
import re
from email_helper import send_exam_notification


client = None
# db_name = os.environ.get('DATABASE')
db_name = 'flask.db'

time = datetime.now() + timedelta(days=7)
seven_days_later = time.strftime('%Y-%m-%d')


@lru_cache(maxsize=512)
def getDB(db_name):
    # creates a database in RAM
    global client
    if client is None:
        client = sqlite3.connect(db_name, check_same_thread=False)
        db = client.cursor()
    return db

def closeClient():
    global client

    if client is not None:
        client.close()


def get_upcoming_exam():
    db = getDB(db_name)
    db.execute("SELECT name FROM exam WHERE date(date) = date(?) AND active = 1", (seven_days_later,))
    date = db.fetchall()
    exams = []
    for d in date:
        exams.append(d[0])
    return exams


def get_user_email():
    db = getDB(db_name)
    db.execute("SELECT username FROM users")
    user_emails = []
    user_name = db.fetchall()
    for u in user_name:
        if is_email(u[0]):
            user_emails.append(u[0])
    return user_emails


def is_email(address):
    email_regex = r"[^@]+@[^@]+\.[^@]+"

    if re.match(email_regex, address):
        return True
    else:
        return False


def send_notification():
    exams = get_upcoming_exam()
    user_emails = get_user_email()
    if exams:
        send_exam_notification(exams = exams, user_emails = user_emails)


if __name__ == "__main__":
    send_notification()
    closeClient()
