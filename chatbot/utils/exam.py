from datetime import datetime, timedelta
import re
from utils.email import send_exam_notification
from utils.db import DB

time = datetime.now() + timedelta(days=7)
seven_days_later = time.strftime('%Y-%m-%d')

def get_upcoming_exam():
    DB.execute("SELECT name FROM exam WHERE date(date) = date(?) AND active = 1", (seven_days_later))
    date = DB.fetchall()
    exams = []
    for d in date:
        exams.append(d[0])
    return exams

def get_user_email():
    DB.execute("SELECT username FROM users")
    user_emails = []
    user_name = DB.fetchall()
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

# this will be called if run in termin alone
if __name__ == "__main__":
    # TODO open DB
    send_notification()
    # TODO close DB