import requests
import json

response = requests.post("http://localhost:5000/api/course/delete", json={"id_course":3})
print(response.text)

response = requests.post("http://localhost:5000/api/course/get", json={})
print(response.text)
