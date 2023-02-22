#!/bin/bash

cd /app
# python app.py
python app.py &
tail -f /dev/null
