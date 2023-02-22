import requests
import json

edit_task_data = {
    "id_task": 6,
    "title": "Edited title of task",
    "description" : "Edited Description of task",
    "resources": "EditedTaskResource",
    "deadline": "EditedTaskDeadline",
    "active": 0
}

response = requests.post("http://212.227.208.5/api/task/edit", json=edit_task_data)
print(response.text)

response = requests.post("http://212.227.208.5/api/task/get", json={})
print(response.text)
