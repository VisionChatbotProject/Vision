from utils.email import send_email
import csv
from logging import getLogger
import random

logger = getLogger()

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

def shuffleQuestions(q):
    """
    This function is for shuffling
    the dictionary elements.
    """
    # random.shuffle(q)
    d = []
    for i in q:
        # shuffle the answers
        ans = []
        ans = i[1:].copy()
        random.shuffle(ans[0])
        d.append([i[0], ans[0]])

    return q, d

def get_name_phone(tracker):
    name = tracker.get_slot('name')
    phone = tracker.get_slot('phone')
    return name, phone


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


def show_question_options(question, options):
    s = question + "\n"
    for idx, item in enumerate(options):
        s = s + f"{str(chr(idx + 97))}. {item}\n"
    return s


def user_answer(user_input, options):
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


def send_email_to_teacher(tracker):
    student_email = tracker.get_slot('email')
    teacher_email = tracker.get_slot('teacher_email')
    
    if teacher_email is None:
        return
    
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


def get_user_performance(user_id, course_id, chapter_id, db_connection):

    conn = db_connection
    c = conn.cursor()

    # check the total of right attempts and wrong attempts
    c.execute('''SELECT COUNT(*) FROM questions
                   WHERE course_id=? AND chapter_id=? AND instr(user_email_wrong_answer, ?) > 0''',
              (course_id, chapter_id, user_id))
    total_wrong = c.fetchone()[0]

    c.execute('''SELECT COUNT(*) FROM questions
               WHERE course_id=? AND chapter_id=? AND instr(user_email_right_answer, ?) > 0''',
              (course_id, chapter_id, user_id))
    total_correct = c.fetchone()[0]


    # count the accuracy
    accuracy = total_correct/(total_correct+total_wrong)

    c.close()
    conn.close()
    return str(accuracy)

def buscar(mystring):
    pass
    # if (search("what does",mystring) and search("mean",mystring)) or search("meaning of",mystring) or search("definition of",mystring):
    #     if search("what does",mystring) and search("mean",mystring): 
    #         return mystring.partition("what does ")[2].partition(" mean")[0]
    #     if search("meaning of",mystring): 
    #         return (mystring.partition("meaning of ")[2])
    #     if search("definition of",mystring):
    #         return (mystring.partition("definition of ")[2])
    # else:
    #     return 0