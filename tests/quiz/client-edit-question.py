import requests
import json

edit_question_data = {
    "question_id":36,
    "question_text": "Edited Question with API",
}

response = requests.post("http://212.227.208.5/api/question/edit", json=edit_question_data)
print(response.text)

response = requests.post("http://212.227.208.5/api/questions/get", json={})
print(response.text)