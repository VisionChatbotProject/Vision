import requests
import json

add_task_data = {
    "title": "Title of new task",
    "description" : "Description of new created task",
    "resources": "NewTaskResource",
    "deadline": "NewTaskDeadline",
    "active": 1
}

response = requests.post("http://localhost:5000/api/task/add", json=add_task_data)
print(response.text)

response = requests.post("http://localhost:5000/api/task/get", json={})
print(response.text)
