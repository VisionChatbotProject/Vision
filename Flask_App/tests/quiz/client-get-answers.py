import requests                                                        
response = requests.post("http://212.227.208.5/api/answers/get", json={"question_id":19})                  
#response = requests.post("http://212.227.208.5/api/exams/get", json={})
print(response.text)
