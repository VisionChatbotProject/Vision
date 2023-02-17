#!/bin/bash

cd /app
rasa train # generate model in models/ folder
rasa run --enable-api --cors "*" --debug & #
python3 webtorasa/main.py & # frontend endpoint
rasa run actions --cors "*" --debug --verbose &
tail -f /dev/null