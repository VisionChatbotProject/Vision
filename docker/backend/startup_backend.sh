#!/bin/bash

cd /app
export DATABASE='/config/bot.db'
export DATA=''

if [ -z "$(ls -A ./models)" ]; then
   rasa train # generate model in models/ folder
fi

# agent server
rasa run --enable-api --cors "*" --debug & #

# action server
python3 webtorasa/main.py & # frontend endpoint
rasa run actions --cors "*" --debug --verbose &

tail -f /dev/null