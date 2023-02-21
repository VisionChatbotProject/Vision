import requests
import json

response = requests.post("http://localhost:5000/api/intent/delete", json={"id_intent":15})
print(response.text)

response = requests.post("http://localhost:5000/api/intent/get", json={})
print(response.text)
