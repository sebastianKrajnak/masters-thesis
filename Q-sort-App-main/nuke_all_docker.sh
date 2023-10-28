!#/bin/bash

docker kill Ubuntu-Vue3-Q-sort-frontend
docker rm Ubuntu-Vue3-Q-sort-frontend
docker rmi docker_frontend
docker builder prune