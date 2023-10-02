#!/bin/sh

rm -rf /app/*
unzip /share/scormcourse.zip -d /app
scorm-server -p 5001 -r app
# tail -f /dev/null