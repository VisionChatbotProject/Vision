import requests
import json

edit_exam_data = {
    "id_exam":2,
    "name": "Edited name of exam",
    "id_course": 2,
    "record": "Edited record of exam",
    "description": "Edited description of exam", 
    "observations": "Edited observation of exam",
    "exam_date": "Edited exam date"
}

response = requests.post("http://212.227.208.5/api/exam/edit", json=edit_exam_data)
print(response.text)

response = requests.post("http://212.227.208.5/api/exam/get", json={})
print(response.text)
