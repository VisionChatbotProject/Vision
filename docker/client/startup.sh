#!/bin/sh

cd /app
npm install http-server
npx http-server --cors . &
tail -f /dev/null