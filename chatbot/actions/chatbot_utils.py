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
