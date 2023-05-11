#!/bin/bash

cd /app
export DATABASE='/config/bot.db'
export DATA=''

# action server
rasa run actions --cors "*" --debug --verbose --auto-reload #&

# tail -f /dev/null