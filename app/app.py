import os
import json
import pdb
import random
import sys
import sqlite3
import time
import traceback
import subprocess
import flask
from urllib.parse import urlsplit, parse_qs
from flask import Flask, session, render_template, request, url_for, flash, redirect, jsonify
from flask_login import LoginManager, login_user, current_user, login_required, UserMixin
#from flask.ext.login import LoginManager,login_user
from asgiref.wsgi import WsgiToAsgi
import docker
import asyncio
#users =  { "user1": "1", "user2": "2", "user3": "psw123" }

class User(UserMixin):
    def __init__(self, name, id, active=True):
        self.name = name
        self.id = id
        self.active = active

    def get_id(self):
        return self.id


    def is_active(self):
        # Here you should write whatever the code is
        # that checks the database if your user is active
        return self.active

    def is_anonymous(self):
        return False

    def is_authenticated(self):
        return True

    def __str__(self):
        return "User, name=" + self.name + ",id=" + self.id

def get_db_connection():
    conn = sqlite3.connect(os.environ.get('DATABASE'))
    conn.row_factory = sqlite3.Row
    return conn

app = Flask(__name__, template_folder='.', static_folder="./style")
app.config['SECRET_KEY'] = 'fxdPZGTdTpo7AmwKFywZ-R1jUDh3yRgx1jUwpVjIp-Z4sjt6axsVlkGv78fKak-secret-key-goes-here'
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "memcached"
asgi_app = WsgiToAsgi(app)

login_manager = LoginManager(app)
login_manager.session_protection = "strong"
login_manager.login_view = 'login'
login_manager.init_app(app)

@app.route('/login')
def login():
    next_page = request.args.get('next')
    return render_template('login.html', next_page=next_page)

@app.route('/login', methods=['POST'])
def login_post():
    global users
    username = request.form.get('username')
    password = request.form.get('password')

    conn = get_db_connection()
    selected_user = conn.execute('SELECT * FROM users WHERE username = ? and password = ?', (username, password)).fetchone()
    conn.close()

    if selected_user:
        login_user(User(selected_user["username"],selected_user["username"]))
        next_page = request.args.get('next')
        if next_page:
            return redirect(next_page)
        else:
            return redirect(url_for('index'))
    return redirect(url_for('login'))   
 
@app.route('/')
@app.route('/index')
@app.route('/index.html')
@login_required
def index():
    return render_template('index.html')

@app.route('/api/course/get', methods=['GET'])
def api_get_course():
    try:
        json_body = request.form
        where_clause = (' where ' + ' or '.join(map(lambda i: 'id_course=' + str(i), json_body['ids']))) if 'ids' in json_body else ''
        result_courses = []
        conn = get_db_connection()
        courses = conn.execute('SELECT * FROM course' + where_clause).fetchall()
        for course in courses:
            result_courses.append({"id_course":course["id_course"],"name":course["name"],"teacher":course["teacher"],"chapters":course["chapters"],"materials":course["materials"],"materials":course["description"],"externresources":course["externressources"],"email_teacher":course["email_teacher"]})
        conn.close()
        return jsonify({"success":True, "courses": result_courses})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })

@app.route('/courses')
@login_required
def show_courses():
    conn = get_db_connection()
    courses = conn.execute('SELECT * FROM course').fetchall()
    conn.close()
    return render_template('courses.html', courses=courses)

@app.route('/api/chapter/get', methods=['GET'])
def api_get_chapter():
    try:
        json_body = request.form
        where_clause = (' where ' + ' or '.join(map(lambda i: 'id_chapter=' + str(i), json_body['ids']))) if 'ids' in json_body else ''
        result_chapters = []
        conn = get_db_connection()
        chapters = conn.execute('SELECT * FROM chapter' + where_clause).fetchall()
        for chapter in chapters:
            result_chapters.append({"id_chapter":chapter["id_chapter"],"name_chapter":chapter["name_chapter"],"short_description":chapter["short_description"],"content":chapter["content"]})
        conn.close()
        return jsonify({"success":True, "chapters": result_chapters})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })

@app.route('/chapters')
@login_required
def show_chapters():
    conn = get_db_connection()
    chapters = conn.execute('SELECT * FROM chapter').fetchall()
    conn.close()
    return render_template('chapters.html', chapters=chapters)

@app.route('/api/task/get', methods=['GET'])
def api_get_task():
    try:
        json_body = request.form
        where_clause = (' where ' + ' or '.join(map(lambda i: 'id_task=' + str(i), json_body['ids']))) if 'ids' in json_body else ''
        result_tasks = []
        conn = get_db_connection()
        tasks = conn.execute('select * from task' + where_clause).fetchall()
        for task in tasks:
            result_tasks.append({"id_task":task["id_task"],"title":task["title"],"description":task["description"],"resources":task["ressources"],"deadline":task["deadline"],"active":task["active"]})
        conn.close()
        return jsonify({"success":True, "tasks": result_tasks})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })

@app.route('/tasks')
@login_required
def show_tasks():
    conn = get_db_connection()
    tasks = conn.execute('select * from task').fetchall()
    conn.close()
    return render_template('tasks.html', tasks=tasks)

@app.route('/api/intent/get', methods=['GET'])
def api_get_intent():
    try:
        json_body = request.form
        where_clause = (' where ' + ' or '.join(map(lambda i: 'id_intent=' + str(i), json_body['ids']))) if 'ids' in json_body else ''
        result_intents = []
        conn = get_db_connection()
        intents = conn.execute('select * from intent' + where_clause).fetchall()
        for intent in intents:
            result_intents.append({"id_intent":intent["id_intent"],"intent_name":intent["intent_name"],"intent_list":intent["intent_list"],"response":intent["response"]})
        conn.close()
        return jsonify({"success":True, "intents": result_intents})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })

#
# Train Edit ------------------------------------------------------------------
#
@app.route('/api/train/edit', methods=['PUT'])
def api_train_update():

    def update_end_time(uuid, end_time):       
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE training SET end_time = ? WHERE uuid = ?", (end_time, uuid))
        conn.commit()
        conn.close()

    try:

        uuid = request.json.get("uuid")
        end_time = request.json.get("end_time")

        update_end_time(uuid, end_time)

        return jsonify({"success":True, "uuid": uuid})
    
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })

#
# Train Add -------------------------------------------------------------------
#
@app.route('/api/train/add', methods=['POST'])
async def api_train_add(): 
    
    def add_training(uuid, start_time):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO training('uuid', 'start_time') VALUES (?, ?)", 
            (uuid, start_time)
        )
        new_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return new_id

    def train(uuid):
        try:
            docker_client = docker.DockerClient(base_url='unix://var/run/docker.sock')
            # container_name = "vision-chatbot-agent"#
            container_name = "authoring-chatbot-agent"
            my_container = docker_client.containers.get(container_name)
            # Call train script asynchron with &        
            stdout = my_container.exec_run(cmd=f"/bin/bash -c /develop/train.sh {uuid}")
            my_container.restart()
            msg = "Server reloading ... "+str(stdout)
        except Exception as e:
            msg = "Docker error: " + str(e)
        
    try:

        uuid = request.json['uuid']
        start_time = request.json['start_time']
        new_id = add_training(uuid, start_time)
        # heavy_process = Process(target=train(uuid), daemon=True)
        # heavy_process.start()
        await asyncio.gather(
            train(uuid)
        )
        msg = ""
        return jsonify({"success":True, "id": new_id, "uuid": uuid, "msg": msg})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })


@app.route('/api/intent/train', methods=['POST'])
def api_train_intent():
    try:
 
        docker_client = docker.DockerClient(base_url='unix://var/run/docker.sock')
        # container_name = "vision-chatbot-agent"
        container_name = "authoring-chatbot-agent"
        my_container = docker_client.containers.get(container_name)
        stdout = my_container.exec_run(cmd="/bin/bash -c \"mv /config/contessa.tar.gz /config/contessa_"+str(time.time())+".tar.gz\"")
        my_container.restart()      

        msg = "Server reloading ... " + str(stdout)
        return jsonify({"success":True, "id": -1, "msg": msg})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })

@app.route('/intent', methods=['GET', 'POST'])
@login_required
def show_intents():
    conn = get_db_connection()
    intents = conn.execute('select * from intent').fetchall()
    conn.close()
    trainBot = flask.request.form.get('submit')
    msg = ""
    if trainBot is not None and 'trainbot' in trainBot:
        try:
            if (os.environ.get('FLASK_SYSTEM') == 'smartstudy'):                
                docker_client = docker.DockerClient(base_url='unix://var/run/docker.sock')
                my_container = docker_client.containers.get("vision-chatbot-agent")
                stdout = my_container.exec_run(cmd="/bin/bash -c \"cd /app && rasa train --force\"")
                my_container.restart()
            else:
                stdout = subprocess.check_output(["./exampl.sh"]).decode("utf-8")
            msg = "Training Executed Successfully. Please wait at least five minutes until next training." + str(stdout)
        except Exception as e:
            msg = "Failed to train" + str(e)
            pass
    return render_template('intent.html', intents=intents, msg=msg)

@app.route('/api/course/add', methods=['POST'])
def api_add_course():
    try:
        json_body = request.form
        required_fields = ["name", "teacher", "chapters", "materials", "description", "externresources",'email_teacher', 'course_start', 'course_end']
        [required_fields.remove(key) if key in required_fields else "" for key in json_body]
        if len(required_fields) > 0:
            return jsonify({"success": False, "description": "Missing fields " + ", ".join(required_fields)})
        else:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO course('name','teacher','chapters','materials','description','externressources', 'email_teacher', 'course_start', 'course_end') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (json_body["name"], json_body["teacher"], json_body["chapters"], json_body["materials"], json_body["description"], json_body["externresources"], json_body['email_teacher'], json_body['course_start'], json_body['course_end']))
            new_id = cursor.lastrowid
            conn.commit()
            conn.close()
            return jsonify({"success": True, "id": new_id, "description": "New course has been added"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e), "traceback": str(traceback.format_exc())})


@app.route('/course/add', methods=('GET', 'POST'))
@login_required
def add_course(): 
    if request.method == 'POST':

        name = request.form["name"].strip()
        teacher = request.form["teacher"].strip()
        chapters = request.form["chapters"].strip()
        resources = request.form["materials"].strip()
        description = request.form["description"].strip()
        externressources = request.form["externressources"].strip()
        email_teacher = request.form["email_teacher"].strip()
                  
        conn = get_db_connection()
        conn.execute("INSERT INTO course('name','teacher','chapters','materials','description','externressources','email_teacher') VALUES (?, ?, ?, ?, ?, ?, ?)",
                         (name, teacher, chapters, resources, description, externressources, email_teacher))
        conn.commit()
        conn.close()

        return redirect(url_for('show_courses'))
    else:
        return render_template('add_course.html')


@app.route('/api/chapter/add', methods=['POST'])
def api_add_chapter():
    try:
        json_body = request.form
        required_fields = ["name_chapter", "short_description", "content", "resources", "id_course"]
        [required_fields.remove(key) if key in required_fields else "" for key in json_body]
        if len(required_fields) > 0:
            return jsonify({"success": False, "description": "Missing fields " + ", ".join(required_fields)})
        else:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO chapter('name_chapter','short_description','content', 'id_course') VALUES (?, ?, ?, ?)",
                (json_body["name_chapter"], json_body["short_description"], json_body["content"], json_body["id_course"]))
            new_id = cursor.lastrowid
            conn.commit()
            conn.close()
            return jsonify({"success": True, "id": new_id, "description": "New chapter has been added"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e), "traceback": str(traceback.format_exc())})


@app.route('/chapter/add', methods=('GET', 'POST'))
@login_required
def add_chapter(): 
    if request.method == 'POST':
        name_chapter = request.form["name_chapter"].strip()
        short_description = request.form["short_description"].strip()
        content = request.form["content"].strip()
    
        conn = get_db_connection()
        conn.execute("INSERT INTO chapter('name_chapter','short_description','content') VALUES (?, ?, ?)",
                         (name_chapter, short_description, content))
        conn.commit()
        conn.close()

        return redirect(url_for('show_chapters'))
    else:
        return render_template('add_chapter.html')

@app.route('/api/task/add', methods=['POST'])
def api_add_task():
    try:
        json_body = request.form
        required_fields = ["title", "description", "resources", "deadline", "active", "id_course", "id_chapter"]
        [required_fields.remove(key) if key in required_fields else "" for key in json_body]
        if len(required_fields) > 0:
            return jsonify({"success": False, "description": "Missing fields " + ", ".join(required_fields)})
        else:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO task('title','description','ressources', 'deadline','active', 'id_course', 'id_chapter') VALUES (?, ?, ?, ?, ?, ?, ?)",
                (json_body["title"], json_body["description"], json_body["resources"], json_body["deadline"],
                 json_body["active"], json_body["id_course"], json_body["id_chapter"]))
            new_id = cursor.lastrowid
            conn.commit()
            conn.close()
            return jsonify({"success": True, "id": new_id, "description": "New task has been added"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e), "traceback": str(traceback.format_exc())})



@app.route('/task/add', methods=('GET', 'POST'))
@login_required
def add_task(): 
    if request.method == 'POST':

        title = request.form["titel"].strip()
        description = request.form["description"].strip();
        resources = request.form["ressources"].strip();
        deadline = request.form["deadline"];
        if "active" in request.form: #if request.form["active"]=='on':
            active = 1
        else:
            active = 0
        
        conn = get_db_connection()
        conn.execute("INSERT INTO task('title','description','ressources', 'deadline','active') VALUES (?, ?, ?, ?, ?)",
                         (title, description, resources, deadline, str(active)))
        conn.commit()
        conn.close()

        return redirect(url_for('show_tasks'))
    else:
        return render_template('add_task.html')

@app.route('/api/intent/add', methods=['POST'])
def api_add_intent():
    try:
        json_body = request.form
  
        required_fields = ["intent_name", "intent_list", "response", "is_quiz", "id_chapter", "id_course"]
        [required_fields.remove(key) if key in required_fields else "" for key in json_body]
        if len(required_fields) > 0:
            return jsonify({"success": False, "description": "Missing fields " + ", ".join(required_fields)})
        
        # execute insert process
        else:
            # insert intent
            conn = get_db_connection()
            cursor = conn.cursor()

            # json_body = ImmutableMultiDict([('intent_name', 'Intent 505050'), ('intent_list', 'Intent 505050'), ('is_quiz', 'True'), ('response', 'Intent 505050'), ('id_course', '18'), ('id_chapter', '-1')])
            is_quiz_int = int(eval(json_body["is_quiz"]))
        
            cursor.execute("INSERT INTO intent('intent_name','intent_list','response', 'is_quiz', 'id_course', 'id_chapter') VALUES (?, ?, ?, ?, ?, ?)",
                           (json_body["intent_name"], json_body["intent_list"], json_body["response"], is_quiz_int, json_body["id_course"], json_body["id_chapter"]))
            intent_id = cursor.lastrowid

            # creat quiz and insert question to question table if is_quiz is true
            if json_body["is_quiz"]:

                cursor.execute("INSERT INTO quizs(quiz_name) VALUES (?)",
                               [json_body["intent_name"]])
                quiz_id = cursor.lastrowid

                cursor.execute("INSERT INTO questions(quiz_id, question_text) VALUES (?, ?)",
                               [str(quiz_id), json_body["intent_list"]])
                question_id = cursor.lastrowid

                cursor.execute("INSERT INTO answers(question_id, answer_text, is_correct) VALUES (?, ?, ?)",
                               [str(question_id), json_body["response"], str(1)])
            conn.commit()
            conn.close()

            return jsonify({"success": True, "id": intent_id, "description": "New intent has been added"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e), "traceback": str(traceback.format_exc())})


@app.route('/intent/add', methods=('GET', 'POST'))
@login_required
def add_intent(): 
    if request.method == 'POST':

        intent_name = request.form["intent_name"].strip()
        intent_list = request.form.getlist("intent_list[]")
        response = request.form["response"].strip()
                              
        conn = get_db_connection()
        conn.execute("INSERT INTO intent('intent_name','intent_list','response') VALUES (?, ?, ?)",
                         (intent_name, intent_list, response))
        conn.commit()
        conn.close()

        return redirect(url_for('show_intents'))
    else:
        return render_template('add_intent.html')

@app.route('/api/exam/add', methods=['POST'])
def api_add_exam():
    try:
        json_body = request.form
        required_fields = ["name","description" "date", "active", "id_course", "id_chapter"]
        [required_fields.remove(key) if key in required_fields else "" for key in json_body]
        if len(required_fields) > 0:
            return jsonify({"success":False, "description": "Missing fields " + ", ".join(required_fields)})
        else:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("INSERT INTO exam('name', 'description',  'date', 'active', 'id_course', 'id_chapter') VALUES (?, ?, ?, ?, ?, ?)",
                           (json_body["name"], json_body["description"], json_body["date"], json_body["active"], json_body["id_course"], json_body["id_chapter"]))
            new_id = cursor.lastrowid
            conn.commit()
            conn.close()
            return jsonify({"success":True, "id":new_id, "description":"New exam has been added"})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })

@app.route('/api/course/edit', methods=['PUT'])
def api_edit_course():
    try:
        json_body = request.form
        required_fields = ["id_course", "name", "teacher", "chapters", "materials", "description", "externresources", "email_teacher",'course_start', 'course_end']
        [required_fields.remove(key) if key in required_fields else "" for key in json_body]
        if len(required_fields) > 0:
            return jsonify({"success":False, "description": "Missing fields " + ", ".join(required_fields)})
        else:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("update course set name=?, teacher=?, email_teacher=?, chapters=?, description=?, materials=?, externressources=?, course_start=?, course_end=? where id_course=?",
                         (json_body["name"], json_body["teacher"], json_body["email_teacher"], json_body["chapters"], json_body["description"], json_body["materials"], json_body["externresources"] ,json_body["course_start"],json_body["course_end"],str(json_body["id_course"])))
            num_affected = cursor.rowcount
            conn.commit()
            conn.close()
            return jsonify({"success":True, "description": str(num_affected) + " course(s) has been updated"})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })

@app.route('/course/edit/<int:id>', methods=('GET', 'POST'))
@login_required
def edit_course(id):
    if request.method == 'POST':
        name = request.form["name"].strip()
        teacher = request.form["teacher"].strip()
        email_teacher = request.form["email_teacher"].strip()
        chapters = request.form["chapters"].strip()
        description = request.form["description"].strip()
        materials = request.form["materials"].strip()
        externressources = request.form["externressources"].strip()
        email_teacher = request.form["email_teacher"].strip()

        conn = get_db_connection()
        conn.execute("update course set name=?, teacher=?, email_teacher=?, chapters=?, description=?, materials=?, externressources=?, email_teacher=? where id_course=?",
                         (name, teacher, email_teacher, chapters, description, materials, externressources, email_teacher, str(id)))
        conn.commit()
        conn.close()

        return redirect(url_for('show_courses'))
    else:
        conn = get_db_connection()
        course = conn.execute('select * from course where id_course=?', [str(id)]).fetchone()
        conn.close()
        return render_template('edit_course.html', course=course)

@app.route('/api/chapter/edit', methods=['PUT'])
def api_edit_chapter():
    try:
        json_body = request.form
        required_fields = ["id_chapter", "name_chapter","short_description","content", "resources", "id_course"]
        [required_fields.remove(key) if key in required_fields else "" for key in json_body]
        if len(required_fields) > 0:
            return jsonify({"success":False, "description": "Missing fields " + ", ".join(required_fields)})
        else: 
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("update chapter set name_chapter = ?, short_description = ?, content = ?, id_course=? where id_chapter=?",
                             (json_body["name_chapter"], json_body["short_description"], json_body["content"], json_body["id_course"], str(json_body["id_chapter"])))
            num_affected = cursor.rowcount
            conn.commit()
            conn.close()
            return jsonify({"success":True, "description": str(num_affected) + " chapter(s) has been updated"})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })


@app.route('/chapter/edit/<int:id>', methods=('GET', 'POST'))
@login_required
def edit_chapter(id):
    if request.method == 'POST':
        name_chapter = request.form["name_chapter"].strip()
        short_description = request.form["short_description"].strip()
        content = request.form["content"].strip()
    
        conn = get_db_connection()
        conn.execute("update chapter set name_chapter = ?, short_description = ?, content = ?, where id_chapter=?",
                         (name_chapter, short_description, content, str(id)))
        conn.commit()
        conn.close()

        return redirect(url_for('show_chapters'))
    else:
        conn = get_db_connection()
        chapter = conn.execute('select * from chapter where id_chapter=?', [str(id)]).fetchone()
        conn.close()
        return render_template('edit_chapter.html', chapter=chapter)

@app.route('/api/intent/edit', methods=['PUT'])
def api_edit_intent():
    try:
        json_body = request.form
        required_fields = ["id_intent", "intent_name","intent_list","response", "is_quiz"]
        [required_fields.remove(key) if key in required_fields else "" for key in json_body]
        if len(required_fields) > 0:
            return jsonify({"success":False, "description": "Missing fields " + ", ".join(required_fields)})
        else: 
            conn = get_db_connection()
            cursor = conn.cursor()
            is_quiz_int = int(eval(json_body["is_quiz"]))
            cursor.execute("update intent set intent_name = ?, intent_list = ?, response = ?, id_course=?, id_chapter=?, is_quiz=? where id_intent=?",
                             (json_body["intent_name"], json_body["intent_list"], json_body["response"], json_body["id_course"], json_body["id_chapter"], is_quiz_int, str(json_body["id_intent"])))
            num_affected = cursor.rowcount
            
            # creat quiz and insert question to question table if is_quiz is true
            if json_body["is_quiz"]:
                pass
                # needs to be implemented/updated
                
                # cursor.execute("INSERT INTO quizs(quiz_name) VALUES (?)",
                #                [json_body["intent_name"]])
                # quiz_id = cursor.lastrowid

                # cursor.execute("INSERT INTO questions(quiz_id, question_text) VALUES (?, ?)",
                #                [str(quiz_id), json_body["intent_list"]])
                # question_id = cursor.lastrowid

                # cursor.execute("INSERT INTO answers(question_id, answer_text, is_correct) VALUES (?, ?, ?)",
                #                [str(question_id), json_body["response"], str(1)])
            
            conn.commit()
            conn.close()
            return jsonify({"success":True, "description": str(num_affected) + " intent(s) has been updated"})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })

@app.route('/intent/edit/<int:id>', methods=('GET', 'POST'))
@login_required
def edit_indent(id):
    if request.method == 'POST':
        intent_name = request.form["intent_name"].strip()
        intent_list = request.form["intent_list"].strip()
        response = request.form["response"].strip()
          
        conn = get_db_connection()
        conn.execute("update intent set intent_name = ?, intent_list = ?, response = ? where id_intent=?",
                         (intent_name, intent_list, response, str(id)))
        conn.commit()
        conn.close()

        return redirect(url_for('show_intents'))
    else:
        conn = get_db_connection()
        intent = conn.execute('select * from intent where id_intent=?', [str(id)]).fetchone()
        conn.close()
        return render_template('edit_intent.html', intent=intent)

@app.route('/api/task/edit', methods=['PUT'])
def api_edit_task():
    try:
        json_body = request.form
        required_fields = ["id_task", "title", "description", "resources", "deadline", "active"]
        [required_fields.remove(key) if key in required_fields else "" for key in json_body]
        if len(required_fields) > 0:
            return jsonify({"success":False, "description": "Missing fields " + ", ".join(required_fields)})
        else: 
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("update task set title=?, description=?, ressources=?, deadline=?, active=?, id_course=?, id_chapter=? where id_task=?",
                           (json_body["title"], json_body["description"], json_body["resources"], json_body["deadline"], str(json_body["active"]), json_body["id_course"], json_body["id_chapter"], str(json_body["id_task"])))
            num_affected = cursor.rowcount
            conn.commit()
            conn.close()
            return jsonify({"success":True, "description": str(num_affected) + " task(s) has been updated"})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })


@app.route('/task/edit/<int:id>', methods=('GET', 'POST'))
@login_required
def edit_task(id):
    if request.method == 'POST':
        print((str(request.form)), file=sys.stderr)                      
        title = request.form["title"].strip()
        description = request.form["description"].strip();
        resources = request.form["ressources"].strip();
        deadline = request.form["deadline"];
        if "active" in request.form:
            active = 1
        else:
            active = 0

        conn = get_db_connection()
        conn.execute("UPDATE TASK SET title=?, description=?, ressources=?, deadline=?, active=? WHERE id_task=?",
                       (title, description, resources, deadline, str(active), str(id)))
        conn.commit()
        conn.close()

        return redirect(url_for('show_tasks'))
    else:
        conn = get_db_connection()
        task = conn.execute('SELECT * FROM task WHERE id_task=?', [str(id)]).fetchone()
        conn.close()
        return render_template('edit_task.html', task=task)

@app.route('/api/exam/edit', methods=['PUT'])
def api_edit_exam():
    try:
        json_body = request.form
        required_fields = ["id_exam","name","description", "date", "active", "id_course", "id_chapter"]
        [required_fields.remove(key) if key in required_fields else "" for key in json_body]
        if len(required_fields) > 0:
            return jsonify({"success":False, "description": "Missing fields " + ", ".join(required_fields)})
        else:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("update exam set name=?, description=?, date=?, active=?, id_course=?, id_chapter=? where id_exam=?",
                           (json_body["name"], json_body["description"], json_body["date"], json_body["active"], json_body["id_course"], json_body["id_chapter"], str(json_body["id_exam"])))
            num_affected = cursor.rowcount
            conn.commit()
            conn.close()
            return jsonify({"success":True, "description": str(num_affected) + " exam(s) has been updated"})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })

@app.route('/api/course/delete', methods=['DELETE'])
def api_delete_course():
    try:
        json_body = request.form
        required_fields = ["id_course"]
        [required_fields.remove(key) if key in required_fields else "" for key in json_body]
        if len(required_fields) > 0:
            return jsonify({"success":False, "description": "Missing fields " + ", ".join(required_fields)})
        else: 
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("delete from course where id_course=?", (str(json_body["id_course"])))
            num_affected = cursor.rowcount
            conn.commit()
            conn.close()
            return jsonify({"success":True, "description": str(num_affected) + " course(s) has been deleted"})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })

@app.route('/course/delete/<int:id>')
@login_required
def delete_course(id):
    conn = get_db_connection()
    conn.execute('delete from course where id_course=?', [str(id)])
    conn.commit()
    conn.close()
    return redirect(url_for('show_courses'))

@app.route('/api/chapter/delete', methods=['DELETE'])
def api_delete_chapter():
    try:
        json_body = request.form
        required_fields = ["id_chapter"]
        [required_fields.remove(key) if key in required_fields else "" for key in json_body]
        if len(required_fields) > 0:
            return jsonify({"success":False, "description": "Missing fields " + ", ".join(required_fields)})
        else: 
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("delete from chapter where id_chapter=?", (str(json_body["id_chapter"])))
            num_affected = cursor.rowcount
            conn.commit()
            conn.close()
            return jsonify({"success":True, "description": str(num_affected) + " chapter(s) has been deleted"})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })

@app.route('/chapter/delete/<int:id>')
@login_required
def delete_chapter(id):
    conn = get_db_connection()
    conn.execute('delete from chapter where id_chapter=?', [str(id)])
    conn.commit()
    conn.close()
    return redirect(url_for('show_chapters'))

@app.route('/api/intent/delete', methods=['DELETE'])
def api_delete_intent():
    try:
        json_body = request.form
        required_fields = ["id_intent"]
        [required_fields.remove(key) if key in required_fields else "" for key in json_body]
        if len(required_fields) > 0:
            return jsonify({"success":False, "description": "Missing fields " + ", ".join(required_fields)})
        else: 
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("delete from intent where id_intent=?", (str(json_body["id_intent"])))
            num_affected = cursor.rowcount
            conn.commit()
            conn.close()
            return jsonify({"success":True, "description": str(num_affected) + " intent(s) has been deleted"})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })

@app.route('/intent/delete/<int:id>')
@login_required
def delete_intent(id):
    conn = get_db_connection()
    conn.execute('delete from intent where id_intent=?', [str(id)])
    conn.commit()
    conn.close()
    return redirect(url_for('show_intents'))

@app.route('/api/task/delete', methods=['DELETE'])
def api_delete_task():
    try:
        json_body = request.form
        required_fields = ["id_task"]
        [required_fields.remove(key) if key in required_fields else "" for key in json_body]
        if len(required_fields) > 0:
            return jsonify({"success":False, "description": "Missing fields " + ", ".join(required_fields)})
        else: 
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("delete from task where id_task=?", (str(json_body["id_task"])))
            num_affected = cursor.rowcount
            conn.commit()
            conn.close()
            return jsonify({"success":True, "description": str(num_affected) + " task(s) has been deleted"})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })

@app.route('/task/delete/<int:id>')
@login_required
def delete_task(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM task WHERE id_task=?', [str(id)])
    conn.commit()
    conn.close()
    return redirect(url_for('show_tasks'))

@app.route('/api/exam/delete', methods=['DELETE'])
def api_delete_exam():
    try:
        json_body = request.form
        required_fields = ["id_exam"]
        [required_fields.remove(key) if key in required_fields else "" for key in json_body]
        if len(required_fields) > 0:
            return jsonify({"success":False, "description": "Missing fields " + ", ".join(required_fields)})
        else:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("delete from exam where id_exam=?", (str(json_body["id_exam"])))
            num_affected = cursor.rowcount
            conn.commit()
            conn.close()
            return jsonify({"success":True, "description": str(num_affected) + " exam(s) has been deleted"})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })

@app.route('/api/answer/add', methods=['POST'])
def api_add_answer():
    try:
        json_body = request.form
        required_fields = ["question_id", "answer_text", "is_correct"]
        [required_fields.remove(key) if key in required_fields else "" for key in json_body]
        if len(required_fields) > 0:
            return jsonify({"success":False, "description": "Missing fields " + ", ".join(required_fields)})
        else: 
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("INSERT INTO answers(question_id, answer_text, is_correct) VALUES (?, ?, ?)",
                         [str(json_body["question_id"]), json_body["answer_text"], str(json_body["is_correct"])])
            new_id = cursor.lastrowid
            conn.commit()
            conn.close()
            return jsonify({"success":True, "id":new_id, "description": "New answer has been added"})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })

@app.route('/quizs/questions/answers/add/<int:question_id>', methods=('GET', 'POST'))
def add_answer(question_id): 
    if request.method == 'POST':
        #print((str(request.form)), file=sys.stderr)                      
        answer_text = request.form["answer_text"].strip()
        correct = 1 if "correct" in request.form else 0
        
        conn = get_db_connection()
        conn.execute("INSERT INTO answers(question_id, answer_text, is_correct) VALUES (?, ?, ?)", (str(question_id),answer_text,str(correct)))
        conn.commit()
        conn.close()

        return redirect(url_for('show_answers', question_id=question_id))
    else:
        return render_template('add_answer.html')

@app.route('/api/question/add', methods=['POST'])
def api_add_question():
    try:
        json_body = request.form
        required_fields = ["quiz_id", "question_text"]
        [required_fields.remove(key) if key in required_fields else "" for key in json_body]
        if len(required_fields) > 0:
            return jsonify({"success":False, "description": "Missing fields " + ", ".join(required_fields)})
        else: 
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("INSERT INTO questions(quiz_id, question_text) VALUES (?, ?)",
                         [str(json_body["quiz_id"]), json_body["question_text"]])
            new_id = cursor.lastrowid
            conn.commit()
            conn.close()
            return jsonify({"success":True, "id": new_id, "description": "New question has been added"})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })


@app.route('/quizs/questions/add/<int:quiz_id>', methods=('GET', 'POST'))
def add_question(quiz_id): 
    if request.method == 'POST':
        question_text = request.form["question_text"].strip()
        #print((question_text), file=sys.stderr)                      
        conn = get_db_connection()
        conn.execute("INSERT INTO questions(quiz_id, question_text) VALUES (?, ?)", [str(quiz_id), question_text])
        conn.commit()
        conn.close()

        return redirect(url_for('list_questions', quiz_id=quiz_id))
    else:
        return render_template('add_question.html', quiz_id=quiz_id)

@app.route('/api/answer/get', methods=['GET'])
def api_get_answers():
    try:
        json_body = request.form
        question_clause = ""
        where_clause = ""
        if "question_id" in json_body:
            question_id =  json_body["question_id"]
            question_clause = ' question_id=' + str(question_id)
            where_clause = ' WHERE ' + question_clause # + ' OR '.join(map(lambda i: 'question_id=' + str(i), json_body['ids']))) if 'ids' in json_body else ''

        result_answers = []
        conn = get_db_connection()
        answers = conn.execute('SELECT answer_id, answer_text, is_correct FROM answers ' + where_clause).fetchall()
        for answer in answers:
            result_answers.append({'id_answer': answer["answer_id"], 'answer_text': answer["answer_text"], 'is_correct': answer["is_correct"] })
        conn.close()
        return jsonify({"success":True, "answers": result_answers})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })

@app.route('/quizs/questions/answers/<int:question_id>')#, methods=('GET', 'POST'))
def show_answers(question_id):
    conn = get_db_connection()
    answers = conn.execute('SELECT answers.answer_id, answers.answer_text, answers.is_correct FROM answers WHERE answers.question_id=?', [str(question_id)]).fetchall()
    selected_question = conn.execute('SELECT question_text FROM questions WHERE question_id=?', [str(question_id)]).fetchone()        
    conn.close()
    return render_template('answers.html', answers=answers, selected_question=selected_question, question_id=question_id)

@app.route('/api/question/edit', methods=['PUT'])
def api_edit_question():
    try:
        json_body = request.form
        required_fields = ["id_question", "question_text"]
        [required_fields.remove(key) if key in required_fields else "" for key in json_body]
        if len(required_fields) > 0:
            return jsonify({"success":False, "description": "Missing fields " + ", ".join(required_fields)})
        else: 
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("UPDATE questions SET question_text=? WHERE question_id=?",
                         (json_body["question_text"], json_body["id_question"]))
            num_affected = cursor.rowcount
            conn.commit()
            conn.close()
            return jsonify({"success":True, "description": str(num_affected) + " questions(s) has been updated"})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })

@app.route('/quizs/questions/edit/<int:question_id>', methods=('GET', 'POST'))
def edit_question(question_id):
    if request.method == 'POST':  
        question_text = request.form["question_text"].strip()
        conn = get_db_connection()
        conn.execute("UPDATE questions SET question_text=? WHERE question_id=?", (question_text, str(question_id)))
        conn.commit()
        selected_question = conn.execute('SELECT quiz_id FROM questions WHERE question_id=?', [str(question_id)]).fetchone()
        conn.close()
        return redirect(url_for('list_questions', quiz_id=selected_question["quiz_id"]))
    else:
        conn = get_db_connection()
        selected_question = conn.execute('SELECT question_text FROM questions WHERE question_id=?', [str(question_id)]).fetchone()
        conn.close()
        return render_template('edit_question.html', selected_question=selected_question)

@app.route('/api/answer/edit', methods=['PUT'])
def api_edit_answer():
    try:
        json_body = request.form
        required_fields = ["id_answer", "answer_text", "is_correct"]
        [required_fields.remove(key) if key in required_fields else "" for key in json_body]
        if len(required_fields) > 0:
            return jsonify({"success":False, "description": "Missing fields " + ", ".join(required_fields)})
        else: 
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("UPDATE answers SET answer_text = ?, is_correct = ? WHERE answer_id = ?",
                         (json_body["answer_text"], json_body["is_correct"], json_body["id_answer"]))
            num_affected = cursor.rowcount
            conn.commit()
            conn.close()
            return jsonify({"success":True, "description": str(num_affected) + " answer(s) has been updated"})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })
        
@app.route('/quizs/questions/answers/edit/<int:answer_id>', methods=('GET', 'POST'))
def edit_answer(answer_id):
    if request.method == 'POST':  
        answer_text = request.form["answer_text"].strip()
        correct = 1 if "correct" in request.form else 0
        
        conn = get_db_connection()
        conn.execute("UPDATE answers SET answer_text = ?, is_correct = ? WHERE answer_id = ?", (answer_text, str(correct), str(answer_id)))
        conn.commit()
        selected_answer = conn.execute('SELECT answers.question_id, answers.answer_text FROM answers WHERE answer_id=?', [str(answer_id)]).fetchone()
        
        conn.commit()
        conn.close()

        return redirect(url_for('show_answers', question_id=selected_answer['question_id']))
    else:
        conn = get_db_connection()
        selected_answer = conn.execute('SELECT answers.answer_id, answers.answer_text, answers.is_correct FROM answers WHERE answers.answer_id=?', [str(answer_id)]).fetchone()
        conn.close()
        return render_template('edit_answer.html', selected_answer=selected_answer)


@app.route('/api/question/delete', methods=['DELETE'])
def api_delete_question():
    try:
        json_body = request.form
        required_fields = ["question_id"]
        [required_fields.remove(key) if key in required_fields else "" for key in json_body]
        if len(required_fields) > 0:
            return jsonify({"success":False, "description": "Missing fields " + ", ".join(required_fields)})
        else: 
            conn = get_db_connection()
            
            cursor = conn.cursor()
            cursor.execute("PRAGMA foreign_keys = ON")
            cursor.execute("DELETE FROM questions WHERE question_id=?", [str(json_body["question_id"])])
            num_affected = cursor.rowcount

            conn.commit()
            conn.close()
            return jsonify({"success":True, "description": str(num_affected) + " question(s) has been deleted"})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })

@app.route('/quizs/questions/delete/<int:question_id>')
def delete_question(question_id):
    conn = get_db_connection()

    cursor = conn.cursor()
    cursor.execute("PRAGMA foreign_keys = ON")
    selected_question = cursor.execute('SELECT quiz_id FROM questions WHERE question_id=?', [str(question_id)]).fetchone()
    cursor.execute('DELETE FROM questions WHERE question_id=?', [str(question_id)])
    conn.commit()
    conn.close()
    return redirect(url_for('list_questions', quiz_id=selected_question["quiz_id"]))


@app.route('/api/answer/delete', methods=['DELETE'])
def api_delete_answer():
    try:
        json_body = request.form
        required_fields = ["id_answer"]
        [required_fields.remove(key) if key in required_fields else "" for key in json_body]
        if len(required_fields) > 0:
            return jsonify({"success":False, "description": "Missing fields " + ", ".join(required_fields)})
        else: 
            conn = get_db_connection()
            
            cursor = conn.cursor()
            cursor.execute("DELETE FROM answers WHERE answer_id=?", [str(json_body["id_answer"])])
            num_affected = cursor.rowcount

            conn.commit()
            conn.close()
            return jsonify({"success":True, "description": str(num_affected) + " answer(s) has been deleted"})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })

@app.route('/quizs/questions/answers/delete/<int:answer_id>')
def delete_answer(answer_id):
    conn = get_db_connection()
    selected_answer = conn.execute('SELECT answers.question_id, answers.answer_text FROM answers WHERE answer_id=?', [str(answer_id)]).fetchone()
    conn.execute('DELETE FROM answers WHERE answer_id=?', [str(answer_id)])
    conn.commit()
    conn.close()
    return redirect(url_for('show_answers', question_id=selected_answer['question_id']))

@app.route('/api/question/get', methods=['GET'])
def api_get_questions():
    try:
        json_body = request.form
        quiz_clause = ""
        where_clause = ""
        if "quiz_id" in json_body:
            quiz_id =  json_body["quiz_id"]
            quiz_clause = ' quiz_id=' + str(quiz_id)
            where_clause = ' WHERE ' + quiz_clause # + ' OR '.join(map(lambda i: 'question_id=' + str(i), json_body['ids']))) if 'ids' in json_body else ''

        result_questions = []
        conn = get_db_connection()
        questions = conn.execute('SELECT questions.question_id, questions.quiz_id, questions.question_text FROM questions ' + where_clause).fetchall()
        for question in questions:
            result_questions.append({'id_question': question["question_id"], 'question_text': question["question_text"] })
        conn.close()
        return jsonify({"success":True, "questions": result_questions})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })

@app.route('/quizs/questions/<int:quiz_id>')
def list_questions(quiz_id):
    conn = get_db_connection()
    questions = conn.execute('SELECT questions.question_id, questions.quiz_id, questions.question_text FROM questions WHERE questions.quiz_id = ?', [str(quiz_id)]).fetchall()
    answers = conn.execute('SELECT answers.answer_id, answers.question_id FROM answers').fetchall()

    questions_dict = {}
    question_rows = []

    for question in questions:
        questions_dict[question['question_id']] = [question['question_text'], 0]

    for answer in answers:
        if answer['question_id'] in questions_dict.keys():
            questions_dict[answer['question_id']][1] = questions_dict[answer['question_id']][1] + 1
    
    for question_id in questions_dict.keys():
        question_rows.append({'question_id': question_id, 'question_text':questions_dict[question_id][0], 'answer_count':questions_dict[question_id][1] })
    #print((str(questions_dict)), file=sys.stderr)                      
    #print((str(answers)), file=sys.stderr)  
                    
    #OUTER JOIN answers ON questions.question_id=answers.question_id').fetchall()
    conn.close()
    return render_template('questions.html', questions=question_rows, quiz_id=quiz_id)


@app.route('/api/quiz/delete', methods=['DELETE'])
def api_delete_quiz():
    try:
        json_body = request.form
        required_fields = ["quiz_id"]
        [required_fields.remove(key) if key in required_fields else "" for key in json_body]
        if len(required_fields) > 0:
            return jsonify({"success":False, "description": "Missing fields " + ", ".join(required_fields)})
        else: 
            conn = get_db_connection()
            
            cursor = conn.cursor()
            cursor.execute("PRAGMA foreign_keys = ON")
            cursor.execute("DELETE FROM quizs WHERE quiz_id=?", [str(json_body["quiz_id"])])
            num_affected = cursor.rowcount

            conn.commit()
            conn.close()
            return jsonify({"success":True, "description": str(num_affected) + " quiz(s) has been deleted"})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })

@app.route('/quizs/delete/<int:quiz_id>', methods=('GET', 'POST'))
def delete_quiz(quiz_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("PRAGMA foreign_keys = ON")
    cursor.execute('DELETE FROM quizs WHERE quiz_id=?', [str(quiz_id)])
    conn.commit()
    conn.close()
    return redirect(url_for('show_quizs'))

@app.route('/api/quiz/edit', methods=['PUT'])
def api_edit_quiz():
    try:
        json_body = request.form
        required_fields = ["id_quiz", "quiz_name", "id_course", "id_chapter"]
        [required_fields.remove(key) if key in required_fields else "" for key in json_body]
        if len(required_fields) > 0:
            return jsonify({"success":False, "description": "Missing fields " + ", ".join(required_fields)})
        else: 
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("UPDATE quizs SET quiz_name=?, id_course=?, id_chapter=? WHERE quiz_id=?",
                         (json_body["quiz_name"], json_body["id_course"], json_body["id_chapter"], json_body["id_quiz"]))
            num_affected = cursor.rowcount
            conn.commit()
            conn.close()
            return jsonify({"success":True, "description": str(num_affected) + " quiz(s) has been updated"})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })


@app.route('/quizs/edit/<int:quiz_id>', methods=('GET', 'POST'))
def edit_quiz(quiz_id):
    if request.method == 'POST':  
        quiz_name = request.form["quiz_name"].strip()
        conn = get_db_connection()
        conn.execute("UPDATE quizs SET quiz_name=? WHERE quiz_id=?", (quiz_name, str(quiz_id)))
        conn.commit()
        conn.close()

        return redirect(url_for('show_quizs'))
    else:
        conn = get_db_connection()
        selected_quiz = conn.execute('SELECT quiz_name FROM quizs WHERE quiz_id=?', [str(quiz_id)]).fetchone()
        conn.close()
        return render_template('edit_quiz.html', selected_quiz=selected_quiz)

@app.route('/api/quiz/add', methods=['POST'])
def api_add_quiz():
    try:
        json_body = request.form
        required_fields = ["quiz_name", "id_course", "id_chapter"]
        [required_fields.remove(key) if key in required_fields else "" for key in json_body]
        if len(required_fields) > 0:
            return jsonify({"success": False, "description": "Missing fields " + ", ".join(required_fields)})
        else:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("INSERT INTO quizs('quiz_name', 'id_course', 'id_chapter') VALUES (?, ?, ?)",
                           [json_body["quiz_name"], json_body["id_course"], json_body["id_chapter"]])
            new_id = cursor.lastrowid
            conn.commit()
            conn.close()
            return jsonify({"success": True, "id": new_id, "description": "New quiz has been added"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e), "traceback": str(traceback.format_exc())})

@app.route('/quizs/add', methods=('GET', 'POST'))
def add_quiz():
    if request.method == 'POST':
        quiz_name = request.form["quiz_name"].strip()
        #print((question_text), file=sys.stderr)                      
        conn = get_db_connection()
        conn.execute("INSERT INTO quizs(quiz_name) VALUES (?)", [quiz_name])
        conn.commit()
        conn.close()

        return redirect(url_for('show_quizs'))
    else:
        return render_template('add_quiz.html')


@app.route('/api/quiz/get', methods=['GET'])
def api_get_quizs():
    try:
        json_body = request.form
        where_clause = (' where ' + ' or '.join(map(lambda i: 'quiz_id=' + str(i), json_body['ids']))) if 'ids' in json_body else ''
        result_quizs = []
        conn = get_db_connection()
        quizs = conn.execute('SELECT quiz_id, quiz_name FROM quizs' + where_clause).fetchall()
        for quiz in quizs:
            result_quizs.append({"id_quiz": quiz["quiz_id"], "quiz_name": quiz["quiz_name"]})
        conn.close()
        return jsonify({"success":True, "quizs": result_quizs})
    except Exception as e:
        return jsonify({"success":False, "error": str(e), "traceback": str(traceback.format_exc()) })

@app.route('/quizs')
def show_quizs():
    conn = get_db_connection()

    quizs = conn.execute('SELECT quizs.quiz_id, quizs.quiz_name FROM quizs').fetchall()
    questions = conn.execute('SELECT questions.question_id, questions.quiz_id, questions.question_text FROM questions').fetchall()

    quiz_dict = {}
    quiz_rows = []

    for quiz in quizs:
        quiz_dict[quiz['quiz_id']] = [quiz['quiz_name'], 0]

    for question in questions:
        if question['quiz_id'] in quiz_dict.keys():
            quiz_dict[question['quiz_id']][1] = quiz_dict[question['quiz_id']][1] + 1
       
    for quiz_id in quiz_dict.keys():
        quiz_rows.append({'quiz_id': quiz_id, 'quiz_name': quiz_dict[quiz_id][0], 'question_count': quiz_dict[quiz_id][1] })
    print((str(quiz_rows)), file=sys.stderr)                      
    #print((str(answers)), file=sys.stderr)  
                    
    #OUTER JOIN answers ON questions.question_id=answers.question_id').fetchall()
    conn.close()
    return render_template('quizs.html', quizs=quiz_rows)


@app.route('/quiz/start/<int:quiz_id>', methods=('GET', 'POST'))
def start_quiz(quiz_id):
    if request.method == 'POST':
        qid = request.form["question_id"]
        session["given_answers"][request.form["question_id"]] = request.form["answer"]
        conn = get_db_connection()
        selected_question = conn.execute('SELECT questions.question_id, questions.question_text, COUNT(answers.answer_id) AS answer_count FROM questions INNER JOIN answers ON questions.question_id=answers.question_id WHERE answers.is_correct=1 AND questions.question_id > ? AND questions.quiz_id=? LIMIT 1', (str(qid), str(quiz_id))).fetchone()
        if selected_question['question_id']:
            answers = conn.execute('SELECT answers.answer_id, answers.answer_text, answers.is_correct FROM answers WHERE answers.question_id=?', (str(selected_question['question_id']))).fetchall()
            session["current_question_id"] = selected_question['question_id']
            conn.close()
            random.shuffle(answers)
            return render_template('quiz.html', selected_question=selected_question, answers=answers)
        else:
            answers = conn.execute('SELECT answers.answer_id, answers.question_id, answers.is_correct FROM answers').fetchall()
            conn.close()
            correct_count = 0
            for answer in answers:
                if str(answer['answer_id']) == str(session["given_answers"][str(answer['question_id'])]):
                    if str(answer['is_correct']) != '0':
                        correct_count = correct_count + 1
            return render_template('quiz_finish.html', correct_count=correct_count, questions_count=len(session["given_answers"]))
    else:
        conn = get_db_connection()
        selected_question = conn.execute('SELECT questions.question_id, questions.question_text, COUNT(answers.answer_id) AS answer_count FROM questions INNER JOIN answers ON questions.question_id=answers.question_id WHERE answers.is_correct=1 AND questions.quiz_id=? LIMIT 1', (str(quiz_id))).fetchone()
        if selected_question['question_id']:
            answers = conn.execute('SELECT answers.answer_id, answers.answer_text, answers.is_correct FROM answers WHERE answers.question_id=?', (str(selected_question['question_id']))).fetchall()
            session["given_answers"] = {}
            session["current_question_id"] = selected_question['question_id']
            conn.close()
            random.shuffle(answers)
            return render_template('quiz.html', selected_question=selected_question, answers=answers)
        else:
            conn.close()
            return render_template('quiz_none.html')

@app.route('/quizs/start', methods=('GET', 'POST'))
def select_quiz():
    conn = get_db_connection()

    quizs = conn.execute('SELECT quizs.quiz_id, quizs.quiz_name FROM quizs').fetchall()
    questions = conn.execute('SELECT questions.question_id, questions.quiz_id, questions.question_text FROM questions').fetchall()

    quiz_dict = {}
    quiz_rows = []

    for quiz in quizs:
        quiz_dict[quiz['quiz_id']] = [quiz['quiz_name'], 0]

    for question in questions:
        if question['quiz_id'] in quiz_dict.keys():
            quiz_dict[question['quiz_id']][1] = quiz_dict[question['quiz_id']][1] + 1
    
    for quiz_id in quiz_dict.keys():
        quiz_rows.append({'quiz_id': quiz_id, 'quiz_name': quiz_dict[quiz_id][0], 'question_count': quiz_dict[quiz_id][1] })
    print((str(quiz_rows)), file=sys.stderr)                      

    conn.close()
    return render_template('quizs_select.html', quizs=quiz_rows)


@app.route('/api/get_quiz_performance/<int:course_id>/<int:chapter_id>', methods=['GET', 'POST'])
def get_quiz_performance(course_id, chapter_id):
    conn = get_db_connection()
    c = conn.cursor()

    # check the total of right attempts and wrong attemps
    c.execute('''SELECT SUM(user_right_answer), SUM(user_wrong_answer) FROM questions
                   WHERE course_id=? AND chapter_id=?''', (course_id, chapter_id))
    correct_answers, wrong_answers = c.fetchone()

    if (correct_answers is None and wrong_answers is not None):
        return str(0)

    if (correct_answers is not None and wrong_answers is None):
        return str(100)
    
    if (correct_answers is None and wrong_answers is None):
        return str(-1)

    # count the accuracy
    accuracy = correct_answers/(correct_answers+wrong_answers)

    c.close()
    conn.close()
    return str(accuracy)
    

@app.route('/api/get_course_performance/<int:course_id>', methods=['GET'])
def get_course_performance(course_id):

    conn = get_db_connection()
    c = conn.cursor()

    c.execute('''SELECT user_right_answer, user_wrong_answer FROM questions WHERE course_id = ?''', (course_id,))

    accuracy = -1
    for row in c.fetchall():
        user_right, user_wrong = row
        total = user_right + user_wrong
        if total != 0:
            accuracy = user_right / total
            
    c.close()
    conn.close()
    return str(accuracy)

@app.route('/api/cleardb', methods=['GET'])
def clear_db():

    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''delete from answers''')
    c.execute('''delete from chapter''')
    c.execute('''delete from course''')
    c.execute('''delete from exam''')
    c.execute('''delete from intent''')
    c.execute('''delete from module_additional_resources''')
    c.execute('''delete from module_tasks''')
    c.execute('''delete from questions''')
    c.execute('''delete from quizs''')
    c.execute('''delete from scores''')
    c.execute('''delete from task''')
    c.execute('''delete from training''')
    # c.execute('''delete from users''')
    c.close()
    conn.commit()
    conn.close()
    return "Success"

@login_manager.user_loader
def load_user(id):
    #print("USER-ID:", str(id))
    return User(id, id)

   
if __name__ == '__main__':
    app.run(host="0.0.0.0")
