#!/bin/bash
cd /app

cp /config/flask.db /config/bot.db

# Generate files for training from db
#
python3 webtorasa/main.py

# Start train the bot and create a model
#
rasa train --fixed-model-name /config/contessa_$1       # /config/contessa_38c196ff-9199-46f3-a6ea-8c7d6f810252

# Remove all models
#
rm -rf /app/models/*

# Copy latest trained model into app/models
#
cp /config/contessa_$1.tar.gz /app/models/contessa.tar.gz

# Set end time after training finished
#
end_time=$(date +%Y-%m-%d\ %H:%M:%S)                    # 2023-06-05 19:43:04
data="{\"uuid\":\"$1\", \"end_time\":\"$end_time\"}"    # {"uuid":"38c196ff-9199-46f3-a6ea-8c7d6f810252", "end_time":"2023-06-05 19:44:43"}
header="Content-Type: application/json"
ACTIVE_BOTAPI_URL=http://authoring-chatbot-api:5000/api
# SERVER=http://vision-frontend:5000/api
URL="$ACTIVE_BOTAPI_URL/train/edit"
curl -X PUT $URL -H "$header" -d "$data"
echo "Finished training ...."