#!/bin/bash
export DATABASE='/config/bot.db'
export DATA=''

cd /app

# action server
rasa run actions --cors "*" --debug --verbose --auto-reload #&

# tail -f /dev/null