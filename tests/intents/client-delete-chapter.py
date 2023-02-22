import requests
import json

response = requests.post("http://localhost:5000/api/chapter/delete", json={"id_chapter":10})
print(response.text)

response = requests.post("http://localhost:5000/api/chapter/get", json={})
print(response.text)
