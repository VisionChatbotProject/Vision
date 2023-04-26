from utils.helper import *
from utils.email_helper import send_email
import csv

subjects = [
    "Maths",
    "Physics",
    "Language",
    "English",
    "Chemistry",
    "Biology",
    "Economics",
    ]


def get_name_phone(tracker):
    name = tracker.get_slot('name')
    phone = tracker.get_slot('phone')
    return name, phone


def _ok_not_ok_buttons():
    return [
        ("Ok", "Ok go ahead"),
        ("not Ok", "No"),
    ]

def _login_button():
    return [("Login", "/login")]

def _yes_no_buttons():
    return [
        ("Yes", "/affirm"),
        ("No", "/deny"),
    ]

def _quiz_buttons(item_list):
    lst = []
    for l in item_list:
        lst.append((l, str(l)))
    return lst

def _subject_buttons(item_list):
    lst = []
    for l in item_list:
        lst.append((l, l))
    return lst


def _show_question_options(question, options):
    s = question + "\n"
    for idx, item in enumerate(options):
        s = s + f"{str(chr(idx + 97))}. {item}\n"
    return s


def _user_answer(user_input, options):
    '''
        user_input is the option selected by the user , i.e. a b c or d or combination
        options:  is the list of options displyed to the user

        user_selection:  will be the text of answer that user intended by selecting a, b, c, d etc...
    '''
    # user_ans = re.split("[\s,]+", user_input.lower())
    alpha = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
    user_ans = [*user_input.lower()]
    user_selection = []
    for ans in set(user_ans):
        if ans in alpha:  # check is input is an aphabet or not
            idx = ord(ans[0])-97  # get the index from the option
            if idx < len(options):
                user_selection.append(options[idx].lower())  # fetch the option from the idex from the option list
    return user_selection




def log_tracker_event(tracker, logger):
    for each in tracker.events:
        # logger.info(each)
        if each['event'] in ['slot']:
            logger.info(f"{each['event']} : {each.get('name')} |  {each.get('value')} ")
        elif each['event'] in ['action', 'form']:
            logger.info(f"{each['event']} : {each.get('name')} ")
        elif each['event'] in ['user', 'bot']:
            logger.info(f"{each['event']} : {each.get('text')} ")


def get_conversation(tracker, full_conversation=0):
    L = []

    for each in tracker.events:
        # logger.info(each)
        if each['event'] in ['slot']:
            if full_conversation:
                L.append(f"{each['event']} : {each.get('name')} |  {each.get('value')} \n")
        elif each['event'] in ['action', 'form']:
            if full_conversation:
                L.append(f"{each['event']} : {each.get('name')} \n")
        elif each['event'] in ['user', 'bot']:
            L.append(f"{each['event']} : {each.get('text')} \n")
    return L


def save_conversation(tracker, logger):
    name, phone = get_name_phone(tracker)
    filename = f"{name}_{phone}_{tracker.sender_id}.txt"
    with open(filename, "w") as myfile:

        L = get_conversation(tracker,full_conversation=1)

        myfile.writelines(L)


def save_convo(tracker, logger):
    user_email = tracker.get_slot('email')
    filename = f"{str(user_email)}_{tracker.sender_id}.csv"

    # writing to csv file
    with open(filename, 'w') as csvfile:
        # creating a csv writer object
        csvwriter = csv.writer(csvfile, delimiter="|")
        rows = []

        for each in tracker.events:
            # logger.info(each)
            if each['event'] in ['user', 'bot']:
                l = []
                l.append(each['event'])
                l.append(each['text'])
                rows.append(l)

        # writing the data rows
        csvwriter.writerows(rows)


def send_email_to_teacher(tracker, student_email, teacher_email):
    receiver_email = None
    if student_email is None:
        user_message =f"Hi, I am unregistered user. I need your help."
        receiver_email = [teacher_email]
    else :
        user_message = f"Hi, I am {student_email}. I need your help."
        receiver_email = [student_email, teacher_email]

    subject = "Need Help"
    # Conversation is between user and bot
    L = get_conversation(tracker)
    message = user_message + "\n".join(L)
    ret = send_email(receiver_email=receiver_email, subject=subject, body=message)
    if ret is False:
        logger.info(f"{__file__} : Error is sending mail , receiver_email = {receiver_email}, subject={subject}, body={message}")


