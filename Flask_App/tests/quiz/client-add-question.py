import requests
import json

add_question_data = {
    "quiz_id": 15,
    "question_text": "Just added question 2"
}

response = requests.post("http://212.227.208.5/api/question/add", json=add_question_data)
print(response.text)

response = requests.post("http://212.227.208.5/api/questions/get", json={})
print(response.text)
