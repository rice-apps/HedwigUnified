# syntax=docker/dockerfile:1.2
FROM node:lts-alpine as build-deps

WORKDIR /hedwig-app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install
COPY . .

COPY . .

EXPOSE 8080
CMD [ "node", "build/index.js" ]
