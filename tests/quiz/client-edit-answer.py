import requests
import json

edit_answer_data = {
     "answer_id": 38,
     "answer_text": "Edited answer with API",
     "is_correct": 0
}

response = requests.post("http://212.227.208.5/api/answer/edit", json=edit_answer_data)
print(response.text)

response = requests.post("http://212.227.208.5/api/answers/get", json={})
print(response.text)