import requests
import json

response = requests.post("http://localhost:5000/api/exam/delete", json={"id_exam":11})
print(response.text)

response = requests.post("http://localhost:5000/api/task/get", json={})
print(response.text)
