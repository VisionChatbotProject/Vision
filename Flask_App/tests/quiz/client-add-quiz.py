import requests
import json

add_exam_data = {
    "quiz_name": "Just created exam",
}

response = requests.post("http://212.227.208.5/api/quiz/add", json=add_exam_data)
print(response.text)

response = requests.post("http://212.227.208.5/api/quizs/get", json={})
print(response.text)
