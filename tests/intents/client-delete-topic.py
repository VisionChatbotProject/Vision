import requests
import json

response = requests.post("http://localhost:5000/api/topic/delete", json={"id_topic":11})
print(response.text)

response = requests.post("http://localhost:5000/api/topic/get", json={})
print(response.text)
