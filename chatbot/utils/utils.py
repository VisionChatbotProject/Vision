from utils.email import send_email
from logging import getLogger

logger = getLogger()

def createHelpButtons(questions):
    buttons = []
    for question in questions:
        buttons.append({ 
            "title": f'{question}',
            "payload": f'{question}'
        })
    return buttons

def button_it(lists):
    buttons = []
    try:
        if not isinstance(lists[0], tuple):
            for i in lists:
                buttons.append(
                    {
                        "title": i,
                        "payload": i,
                    }
                )
        else:
            for i in lists:
                buttons.append({
                    "title": i[0],
                    "payload": i[1]
                })
        return buttons
    except Exception as e:
        logger.exception(e)

def ok_not_ok_buttons():
    return [
        ("Ok", "Ok go ahead"),
        ("not Ok", "No"),
    ]

def login_button():
    return [("Login", "/login")]

def yes_no_buttons():
    return [
        ("Yes", "/affirm"),
        ("No", "/deny"),
    ]

def quiz_buttons(item_list):
    lst = []
    for l in item_list:
        lst.append((l, str(l)))
    return lst

def subject_buttons(item_list):
    lst = []
    for l in item_list:
        lst.append((l, l))
    return lst

'''
    user_input is the option selected by the user , i.e. a b c or d or combination
    options:  is the list of options displyed to the user
    user_selection:  will be the text of answer that user intended by selecting a, b, c, d etc...
'''
def user_answer(user_input, options):
    alpha = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
    user_ans = [*user_input.lower()]
    user_selection = []
    for ans in set(user_ans):
        if ans in alpha:  # check is input is an aphabet or not
            idx = ord(ans[0])-97  # get the index from the option
            if idx < len(options):
                user_selection.append(options[idx].lower())  # fetch the option from the idex from the option list
    return user_selection

def log_tracker_event(tracker):
    for each in tracker.events:
        if each['event'] in ['slot']:
            logger.info(f"{each['event']} : {each.get('name')} |  {each.get('value')} ")
        elif each['event'] in ['action', 'form']:
            logger.info(f"{each['event']} : {each.get('name')} ")
        elif each['event'] in ['user', 'bot']:
            logger.info(f"{each['event']} : {each.get('text')} ")


def get_conversation(tracker, full_conversation=0):
    L = []

    for each in tracker.events:
        if each['event'] in ['slot']:
            if full_conversation:
                L.append(f"{each['event']} : {each.get('name')} |  {each.get('value')} \n")
        elif each['event'] in ['action', 'form']:
            if full_conversation:
                L.append(f"{each['event']} : {each.get('name')} \n")
        elif each['event'] in ['user', 'bot']:
            L.append(f"{each['event']} : {each.get('text')} \n")
    return L

def send_email_to_teacher(tracker):
    teacher_email = tracker.get_slot('teacher_email')
    if teacher_email is None:
        return False
    
    student_email = tracker.get_slot('email')
    subject = "Need Help"
    message = f"Hi, I am {student_email}. I need your help." + "\n".join(get_conversation(tracker))
    response = send_email(receiver_email=[student_email, teacher_email], subject=subject, body=message)
    if response is False:
        logger.info(f"{__file__} : Error is sending mail , receiver_email = {receiver_email}, subject={subject}, body={message}")
        return False
    
    return True