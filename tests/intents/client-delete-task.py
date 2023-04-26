import requests
import json

response = requests.post("http://localhost:5000/api/task/delete", json={"id_task":12})
print(response.text)

response = requests.post("http://localhost:5000/api/task/get", json={})
print(response.text)
