# My project's README

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/538057b565254ab288932d1b0974d654)](https://app.codacy.com/manual/eghantous/landmark-portal?utm_source=github.com&utm_medium=referral&utm_content=eghantous/landmark-portal&utm_campaign=Badge_Grade_Dashboard)


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

