import requests
import json
response = requests.post("http://212.227.208.5/api/question/delete", json={"question_id":35})
print(response.text)