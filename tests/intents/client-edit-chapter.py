import requests
import json

edit_chapter_data = {
    "id_chapter": 8,
    "name_chapter": "ChapterName3",
    "short_description": "ChapterDescription3",
    "content": "ChapterContent3",
    "key_concepts": "ChapterKeyConcepts3",
    "resources": "ChapterResources3",
    "observations": "ChapterObservations3"
}

response = requests.post("http://localhost:5000/api/chapter/edit", json=edit_chapter_data)
print(response.text)

response = requests.post("http://localhost:5000/api/chapter/get", json={})
print(response.text)
