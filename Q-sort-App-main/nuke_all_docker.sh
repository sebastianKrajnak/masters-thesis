#!/bin/bash

# docker kill Ubuntu-Vue3-Q-sort-frontend
# docker rm Ubuntu-Vue3-Q-sort-frontend
# docker rmi docker_frontend
echo "============== Stopping all running containers... =============="
docker stop $(docker ps -a -q)
echo "============== Removing all images, containers and dangling images... =============="
docker rm $(docker ps -a -q)
docker image prune -f
docker rmi $(docker images -a -q)
echo "============== Removing build cache... =============="
docker builder prune -f