from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker, FormValidationAction
from rasa_sdk.types import DomainDict
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet, EventType
from utils.utils import *
from utils.db import *
from utils.quiz import *


# 1. Bug mit Index fixen
# 2. Count of questions

# This class will ask the user to select the quiz that he/she wants to take for form quiz_info_form
class QuizNumber(Action):

    def name(self) -> Text:
        return "action_ask_quiz_number"
    def run(
        self, 
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        

        username = tracker.slots.get("user")

        def getListofQuiz(course_id, username):
 
            sql = f"""select quiz_id, quiz_name from quizs 
                      where id_course = {course_id} and 
                            quiz_id not in 
                                    (select quiz_id FROM scores where username = "{username}" and score > 99)"""

            cursor.execute(sql)
            rows = cursor.fetchall()

            quizs = []
            for row in rows:
                quizs.append({
                    "id": row[0], 
                    "name": row[1]
                })

            return quizs

        def createQuizButtons(quizs):
            buttons = []
            for quiz in quizs:
                buttons.append({ 
                    "title"  : f'{quiz.get("name")}', 
                    "payload": f'{quiz.get("id")}' 
                })
            return buttons


        course_id = current_course_id(tracker)
        logger.info(f"##### action_ask_quiz_number - course_id: {course_id}")


        listofQuiz = getListofQuiz(course_id, username)

        logger.info(f"##### action_ask_quiz_number - listofQuiz: {listofQuiz}")

        if len(listofQuiz) == 0:
            ask = f"There is no quiz for course {tracker.get_slot('quiz_course')}"
            dispatcher.utter_message(text=ask)
        else:
            ask = f"Please enter the quiz number from {listofQuiz}"
            ask = f"Please note that your answers must be separated by a coma"
            buttons = createQuizButtons(listofQuiz)
            dispatcher.utter_message(text=ask, buttons=buttons)

        return []

# action_ask_<slot>
# This class will ask the quiz question to the user for form quiz_info_form
class QuizOver(Action):
    def name(self) -> Text:
        return "action_ask_quiz_over"

    def run(self, 
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:
        

        def getQuestions(quiz_id):
        
            sql = f'select question_id, question_text from questions where quiz_id = {quiz_id} order by question_id'

            cursor.execute(sql)
            rows = cursor.fetchall()

            qeustions = []
            for row in rows:
                qeustions.append({"id" : row[0], "text": row[1]})

            return qeustions
        
        def getAnswers(question_id):
        
            sql = f'select answer_id, answer_text, is_correct from answers where question_id = {question_id} order by answer_id'

            cursor.execute(sql)
            rows = cursor.fetchall()

            answers = []
            for row in rows:
                answers.append({"id" : row[0], "text": row[1], 'is_correct': row[2]})

            return answers

        def getCurrentQuestionIndex():
            quiz_question_count = tracker.get_slot('quiz_question_count')
            if quiz_question_count is None:
                quiz_question_count = 0
            return int(quiz_question_count)
        
        def getQuestionText(questions, currentIndex):
            return questions[currentIndex].get("text")
        
        def getQuestionId(questions, currentIndex):
            return questions[currentIndex].get("id")
        
        def createButtons(questionId, answers):
            buttons = []
            for answer in answers:
                buttons.append({ 
                    "title": answer.get("text"), 
                    "payload": f'{questionId};{answer.get("text")}' 
                })
            return buttons

        questions = getQuestions(tracker.get_slot('quiz_number'))

        if len(questions) == 0:
            dispatcher.utter_message(text=f'There are no questions.')
            return []

        currentIndex = getCurrentQuestionIndex()
        questionId = getQuestionId(questions, currentIndex)
   
        dispatcher.utter_message(text=f'{getQuestionText(questions, currentIndex)}', buttons=createButtons(questionId, getAnswers(questionId)))

        return []

# This class is to called at the end of the quiz. It will show the final score and add the scoe in DB
class QuizFormSubmit(Action):
    def name(self) -> Text:
        return "action_quiz_form_submit"
    
    def run(
        self,
        dispatcher,
        tracker: Tracker,
        domain: DomainDict
    ) -> List[Dict[Text, Any]]:
        
        def getQuizID():
            quizId = tracker.get_slot('quiz_number')
            return quizId

        def getUsername():
            username = tracker.slots.get("user")
            return username
        
        def storeScore(username, quiz_id, date, score):

            sql = f'INSERT INTO scores (quiz_id, username, date_of_quiz, score) VALUES ({quiz_id}, "{username}", datetime("now"), {score});'
            cursor.execute(sql)
            con.commit()
            return cursor.lastrowid 
        
        def getCount(quiz_id):
             
            quiz_id = tracker.get_slot('quiz_number')
            sql = f'SELECT count(*) as count FROM questions where quiz_id = {quiz_id};'
            cursor.execute(sql)
            row = cursor.fetchone()

            return row[0]
    
        def getCalcedScore(quizId):
            count = getCount(quizId)
            quiz_correct_ans = tracker.get_slot('quiz_correct_ans')
            score = int((quiz_correct_ans / count) * 100)

            logger.info(f"getCalcedScore -  quiz_correct_ans: {quiz_correct_ans}, count: {count}")
            
            return score
        
        quizId = getQuizID()
        score = getCalcedScore(quizId)
        username = getUsername()
        now = date.today()

        lastId = storeScore(username, quizId, now, score)
        logger.info(f"storeScore -  lastId: {lastId}")

        dispatcher.utter_message(text=f"Thanks for taking the quiz. You answered {score}% of the questions correctly!")
        

class QuizShowScore(Action):
    def name(self) -> Text:
        return "action_quiz_show_score"
    def run(
        self,
        dispatcher,
        tracker: Tracker,
        domain: DomainDict
    ) -> List[Dict[Text, Any]]:

        email = tracker.get_slot('email')
        if email is not None:
            s = getScore(email)
            dispatcher.utter_message(text=s)
        else:
            dispatcher.utter_message(text="Please login to see your performance")


# This class is to validates the user input given
class ValidateQuizForm(FormValidationAction):
    
    def name(self) -> Text:
        return "validate_quiz_form"

    def validate_quiz_number(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        logger.info(f"validate_quiz_form -  quiz_number: {slot_value}")
        
        # TODO: if number is in list

        return {"quiz_number": slot_value}

    def validate_quiz_over(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        
        def getCount():
             
            quiz_id = tracker.get_slot('quiz_number')
            sql = f'SELECT count(*) as count FROM questions where quiz_id = {quiz_id};'
            cursor.execute(sql)
            row = cursor.fetchone()

            return row[0]
        
        def getCorrectAnswer(questionId):
        
            sql = f'select answer_id, answer_text from answers where question_id = {questionId} and is_correct = 1'

            cursor.execute(sql)
            rows = cursor.fetchall()

            #logger.info(f"validate_quiz_over -  getCorrectAnswer: {questionId}")

            answers = []
            for row in rows:
                answers.append({"id" : row[0], "text": row[1]})
            
            if len(answers) > 0:
                answer = answers[0]
                return answer.get("text")
            
            return ""
        
        def checkSlotAnswer(given_answer):

            xs = given_answer.split(";") # questionId;givenAnswer

            question_id = xs[0]
            givenAnswerText = xs[1]

            correctAnswerText = getCorrectAnswer(int(question_id))

            # logger.info(f"validate_quiz_over -  checkSlotAnswer: {givenAnswerText} == {correctAnswerText} id: {int(question_id)}")

            if givenAnswerText == correctAnswerText:
                return True
            
            return False
        
        def getQuestionCount():
            quiz_question_count = tracker.get_slot('quiz_question_count')
            if not quiz_question_count:
                return 0    
            return int(quiz_question_count)
        
        def getCorrectAnswerCount():
            quiz_correct_ans = tracker.get_slot('quiz_correct_ans')
            if not quiz_correct_ans:
                return 0
            return quiz_correct_ans
        
        def isQuizOver(quiz_correct_ans):
            # Get next question
            if getQuestionCount() < getCount() - 1:
                # Quiz is not over, when slot "quiz_over" is None
                return {"quiz_over": None, 'quiz_question_count': str(currentQuestionCount), "quiz_correct_ans": quiz_correct_ans}
        
            # Quiz is over, when slot "quiz_over" is filleds
            return {"quiz_over": "finished", 'quiz_question_count': str(currentQuestionCount), "quiz_correct_ans": quiz_correct_ans}
            
        currentQuestionCount = getQuestionCount()
        correctAnswerCount = getCorrectAnswerCount()
        if checkSlotAnswer(slot_value):
            correctAnswerCount += 1
    
        # goto to next question
        currentQuestionCount += 1

        user = tracker.get_slot('user')
        logger.info(f"validate_quiz_over - user: {user} - slot_value: {slot_value} - currentQuestionCount: {currentQuestionCount} - correctAnswerCount: {correctAnswerCount}")

        return isQuizOver(correctAnswerCount)
