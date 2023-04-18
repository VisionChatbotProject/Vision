#!/bin/bash

cd /app
export DATABASE='/config/bot.db'
export DATA=''

if [ -z "$(ls -A ./models)" ]; then
   rasa train # generate model in models/ folder
fi

# agent server
rasa run --enable-api --cors "*" --debug & #

tail -f /dev/null