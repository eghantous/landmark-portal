# My project's README


## Run the app ##
```
node server.js
```

## Dockerize app ##
```
docker build -t landmark-portal .
```

## instantiate docker container ##
First, modify docker.env to set the url of the landmark-rest API
```
docker run -t -p 3333:3333 --env-file ./docker.env landmark-portal
```

## start/stop docker container ##
```
docker start/stop [container_id]
```

