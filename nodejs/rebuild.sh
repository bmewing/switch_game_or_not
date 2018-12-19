#! /bin/sh
./node_modules/.bin/babel src --out-dir ./
docker build -t pofigster/switch_or_not .
for f in $(docker ps -aqf "name=epic_heisenberg")
do
    docker stop $f
    docker rm $f
done
docker run --name "epic_heisenberg" -p 80:8080 -d pofigster/switch_or_not 
docker container ls