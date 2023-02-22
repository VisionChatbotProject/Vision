import requests                                                                          
response = requests.post("http://212.227.208.5/api/course/get", json={})
print(response.text)
