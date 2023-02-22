import requests                                                                          
response = requests.post("http://212.227.208.5/api/intent/get", json={})
print(response.text)
