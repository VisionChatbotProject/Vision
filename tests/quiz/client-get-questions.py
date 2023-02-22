import requests                                                        

get_questions_data = {
    "quiz_id": 15,
}

response = requests.post("http://212.227.208.5/api/questions/get", json=get_questions_data)             

print(response.text)
