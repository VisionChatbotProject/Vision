import requests
import json

add_chapter_data = {
    "name_chapter": "ChapterName1",
    "short_description": "ChapterDescription1",
    "content": "ChapterContent1",
    "key_concepts": "ChapterKeyConcepts1",
    "resources": "ChapterResources1",
    "observations": "ChapterObservations1"
}

response = requests.post("http://localhost:5000/api/chapter/add", json=add_chapter_data)
print(response.text)

response = requests.post("http://localhost:5000/api/chapter/get", json={})
print(response.text)
