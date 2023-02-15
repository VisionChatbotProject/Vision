import requests
import json

edit_topic_data = {
    "id_topic": 6,
    "topic": "Edited name of topic",
    "meaning": "Edited meaning",
    "information": "Edited information"
}

response = requests.post("http://212.227.208.5/api/topic/edit", json=edit_topic_data)
print(response.text)

response = requests.post("http://212.227.208.5/api/topic/get", json={})
print(response.text)
