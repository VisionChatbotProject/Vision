import requests
import json

edit_exam_data = {
    "quiz_id":15,
    "quiz_name": "Quiz edited with API",
}

response = requests.post("http://212.227.208.5/api/quiz/edit", json=edit_exam_data)
print(response.text)

response = requests.post("http://212.227.208.5/api/quizs/get", json={})
print(response.text)