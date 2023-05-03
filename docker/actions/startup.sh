#!/bin/bash

cd /app
export DATABASE='/config/bot.db'
export DATA=''

# action server
python3 webtorasa/main.py & # frontend endpoint
rasa run actions --cors "*" --debug --verbose --auto-reload &

tail -f /dev/null