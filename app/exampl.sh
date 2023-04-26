#!/bin/bash
pkill screen
sleep 3
# TODO copy flask.db to bot.db
screen -dm -S actions
screen -S actions -X stuff '. /home/./venv/bin/activate\n'
screen -S actions -X stuff 'cd /home/chatbot\n'
screen -S actions -X stuff 'rasa run actions\n'
screen -dm -S rasaserver
screen -S rasaserver -X stuff '. /home/./venv/bin/activate\n'
screen -S rasaserver -X stuff 'cd /home/chatbot\n'
screen -S rasaserver -X stuff 'python3 webtorasa/main.py\n'
screen -S rasaserver -X stuff 'rasa train\n'
screen -S rasaserver -X stuff 'rasa run --enable-api --cors "*"\n'
