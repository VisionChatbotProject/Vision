#!/bin/bash

cd /app
export DATABASE='/config/bot.db'
export DATA=''

if [ -z "$(ls -A ./models)" ]; then
   rasa train # generate model in models/ folder
fi

rasa run --enable-api --cors "*" --debug & #
python3 webtorasa/main.py & # frontend endpoint
rasa run actions --cors "*" --debug --verbose &
tail -f /dev/null