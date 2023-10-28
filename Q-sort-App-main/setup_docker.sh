#!/bin/bash

cd docker
docker-compose build --no-cache
docker-compose -p q-sort-app up --force-recreate -d