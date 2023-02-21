import requests
import json

response = requests.post("http://212.227.208.5/api/quiz/delete", json={"quiz_id":14})
print(response.text)