import random

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