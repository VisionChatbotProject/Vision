# Vision
Visionbot is an open source chatbot that tries to solve the challenges in remote education.

In the Flask_app folder, there is the chatbot with the flask framework.

# How to run Flask server
Adapt '.env' file to your local setup
cd app
python -m venv env
.\env\Scripts\activate
python -m pip install -r requirements.txt
python -m flask run
Login at http://localhost:5000/

# How to run Docker servers
docker-compose [build|up]

# More
Detailed infos are in the doc/ folder