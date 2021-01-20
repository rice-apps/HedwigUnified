# syntax=docker/dockerfile:1.2
FROM node:lts-alpine as build-deps

WORKDIR /hedwig-app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install
COPY . .

COPY . .

EXPOSE 8080
USER node
ENTRYPOINT ["tini", "--"]
CMD [ "node", "src/index.js" ]
