import requests
import json

add_exam_data = {
    "name": "Name of new exam",
    "id_course": 1,
    "record": "Record of new exam",
    "description": "Description of new exam", 
    "observations": "Observation of new exam",
    "exam_date": "New Exam date"
}

response = requests.post("http://localhost:5000/api/exam/add", json=add_exam_data)
print(response.text)

response = requests.post("http://localhost:5000/api/exam/get", json={})
print(response.text)
