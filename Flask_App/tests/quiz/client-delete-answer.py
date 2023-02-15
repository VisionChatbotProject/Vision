import requests
import json

response = requests.post("http://212.227.208.5/api/answer/delete", json={"answer_id":37})
print(response.text)