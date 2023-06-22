#!/bin/bash
export DATABASE='/config/bot.db'
export DATA=''

chmod +x /develop/replace_vars.sh
/develop/replace_vars.sh
cd /app

# if [ -z "$(ls -A ./models)" ]; then
if [ -f "/config/contessa.tar.gz" ]; then
   echo "Model '/config/contessa.tar.gz' exists, skipping training"
else
   cp '/config/flask.db' '/config/bot.db'
   python3 webtorasa/main.py
   rasa train --fixed-model-name /config/contessa # generate model in models/ folder
   cp '/config/contessa.tar.gz' '/app/models/contessa.tar.gz'
fi

# agent server
# rasa run --enable-api --cors "*" --debug #& #

# tail -f /dev/null
