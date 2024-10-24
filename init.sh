#!/bin/bash

if ! test -f ./.env.production; then
	echo ".env.production is missing"
	exit 1
fi

docker build -t ticketing-service:1.0
docker-compose up 
exit 0
