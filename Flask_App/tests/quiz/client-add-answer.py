import requests
import json

add_answer_data = {
     "question_id": 35,
     "answer_text": "New Correct answer",
     "is_correct": 1
}

response = requests.post("http://212.227.208.5/api/answer/add", json=add_answer_data)
print(response.text)

response = requests.post("http://212.227.208.5/api/answers/get", json={})
print(response.text)