import requests
import json

edit_course_data = {
    "id_course":2,
    "name":"EditedCourseNameSecond_2",
    "teacher":"EditedCourseTeacherSecond_2",
    "chapters":"EditedCourseModulesSecond_2",
    "materials":"EditedCourseResourcesSecond_2",
    "description":"EditedCourseDescriptionSecond_2",
    "externresources":"EditedCourseExternResourcesSecond_2",
    "email_teacher":"teach2@hotmail.com"
}

response = requests.post("http://localhost:5000/api/course/edit", json=edit_course_data)
print(response.text)

response = requests.post("http://localhost:5000/api/course/get", json={})
print(response.text)
