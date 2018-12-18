# Switch Game or Not?
Python code to generate fake Nintendo Switch(r) game names and a dockerized node.js app to run the game

## Dockerization guide
https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

## Why?
The CAGCast, a great podcast, started playing a game called 'Switch Game or Not' and this is my 
attempt at making a website and using basic machine learning at generating fake names.

## Build and Run App
```
./node_modules/.bin/babel src --out-dir ./
docker build -t pofigster/switch_or_not .
docker run -p 80:8080 -d pofigster/switch_or_not
docker container ls
```

## TODO
Fix release week in database
Automate update of database
Finish the app