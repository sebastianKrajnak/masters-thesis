#!/bin/bash

cd docker
docker-compose up -d
docker exec -it Ubuntu-Vue3-Q-sort-frontend bash
docker exec -it WebSocket-server-backend