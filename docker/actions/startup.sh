#!/bin/bash
export DATABASE='/config/bot.db'
export DATA=''

chmod +x /develop/replace_vars.sh
/develop/replace_vars.sh
cd /app

# action server
rasa run actions --cors "*" --debug --verbose --auto-reload #&

# tail -f /dev/null
