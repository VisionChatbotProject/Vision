import requests
import json

edited_intent_data = {
    "id_intent": 6,
    "intent_name": "Edited Intent Name",
    "intent_list": "Edited Intent List",
    "response": "Edited Intent Response"
}

response = requests.post("http://212.227.208.5/api/intent/edit", json=edited_intent_data)
print(response.text)

response = requests.post("http://212.227.208.5/api/intent/get", json={})
print(response.text)
