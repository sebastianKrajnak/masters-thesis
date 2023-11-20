#!/bin/bash

cd docker
echo "============== Building services... =============="
docker compose build --no-cache
echo "============== Starting service containers... =============="
docker compose up
# docker-compose -p q-sort-app up --force-recreate -d