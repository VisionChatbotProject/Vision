#!/bin/bash

cd /app
python app.py &
tail -f /dev/null