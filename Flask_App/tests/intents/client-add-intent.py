import requests
import json

add_intent_data = {
    "intent_name": "New Intent Name",
    "intent_list": "New Intent List",
    "response": "New Intent Response"
}

response = requests.post("http://localhost:5000/api/intent/add", json=add_intent_data)
print(response.text)

response = requests.post("http://localhost:5000/api/intent/get", json={})
print(response.text)
