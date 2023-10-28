# Q-sort
The whole application is developed in Vue.js framework with use of some libraries and tools. The developement was conducted in Docker container for ease of use and for futereproofing when e.g. backend is added.

## How to run the application localy?
**Requirements:**
 + Docker version 20 and newer

### Install & Run Steps (Linux & Linux-subsystem) **RECOMMENDED**
1. Run `./setup_docker.sh`  
2. Wait till everything is installed
3. Run `./run_docker.sh` (this could throw an error if tha container is already running)
4. At the end of previous step you should be inside the container console.
    + If you are not run `docker exec -it Ubuntu-Vue3-Q-sort-frontend bash`
5. Run `npm install`
6. Run `npm run dev`
7. You should see the initialization ov Vite and local address on which the app runs (localhost:8080)

### Install & Run Steps (Windows)
1. Run `cd docker`  
1. `docker-compose build --no-cache`
1. `docker-compose -p q-sort-app up --force-recreate -d`
2. Wait till everything is installed
2. Run `docker-compose up -d` (this could throw an error if tha container is already running)
3. Run `docker exec -it Ubuntu-Vue3-Q-sort-frontend bash`
4. At the end of previous step you should be inside the container console.
5. Run `npm install`
6. Run `npm run dev`
7. You should see the initialization ov Vite and local address on which the app runs (localhost:8080)

### Run steps (Linux & Linux-subsystem) **RECOMMENDED**
3. Run `./run_docker.sh`
6. Run `npm run dev`
7. You should see the initialization ov Vite and local address on which the app runs (localhost:8080)

### Run steps (Windows)
1. Run `cd docker`  
2. Run `docker-compose up -d`
3. Run `docker exec -it Ubuntu-Vue3-Q-sort-frontend bash`
6. Run `npm run dev`
7. You should see the initialization ov Vite and local address on which the app runs (localhost:8080)


## External media contents

```
├── docker ................. (Directory with docker compose and dockerfile.)
├── latex .................. (Directory with the latex files of the thesis.)
├── poster ................. (Directory with Q-sort App poster.)
├── q-sort-app ............. (Directory with source codes and assets for the app.)
│    ├── src ............... (Directory with source files for the app.)
│    │    ├── assets ....... (Directory with datasets, icons, and images.)
│    │    ├── components ... (Directory with all components used in the application.)
│    │    ├── enums ........ (Directory with enums used in the application.)
│    │    ├── fonts ........ (Directory with fonts used in the application.)
│    │    ├── router ....... (Directory with a file configuring the routing of the app.)
│    │    ├── scss ......... (Directory with predefined style files.)
│    │    ├── stores ....... (Directory with all Pinia stores used in the application.)
│    │    ├── views ........ (Directory with all views(pages) used in the application.)
│    │    ├── App.vue ...... (Main component that is injected in the index.html file in higher directory.)
│    │    └── main.js ...... (File containing imports of all used packages and their configurations.)
│    ├── index.html ........ (File inside which Vue injects its' structure and logic.)
│    ├── package.json ...... (File containing all dependencies used in the app.)
│    ├── package-lock.json
│    └── vite.config.js .... (Configuration for Vite.)
├── videos ................. (Directory with videos showcasing the application.)
├── README.md .............. (File with instructions on how to install and run the app locally.)
├── run_docker.sh .......... (Script that will run the Docker container with the application.)
└── setup_docker.sh ........ (Script that will setup a Docker container and download and install all dependencies needed.)

```