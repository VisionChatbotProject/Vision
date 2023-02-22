import requests
import json

add_course_data = {
    "name":"NewCourseName11",
    "teacher":"NewCourseTeacher11",
    "chapters":"NewCourseModules11",
    "materials":"NewCourseMaterials11",
    "description":"NewCourseDescription11",
    "externresources":"NewCourseExternResources11",
    "email_teacher":"teach11@hotmail.com"
}

response = requests.post("http://localhost:5000/api/course/add", json=add_course_data)
print(response.text)

response = requests.post("http://localhost:5000/api/course/get", json={})
print(response.text)
