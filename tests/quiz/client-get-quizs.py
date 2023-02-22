import requests                                                        
#response = requests.post("http://127.0.0.1:5000/api/exams/get", json={})                  
response = requests.post("http://212.227.208.5/api/quizs/get", json={})
print(response.text)
