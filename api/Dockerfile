# syntax=docker/dockerfile:1.2
FROM node:lts-alpine as build

WORKDIR /hedwig-app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install
COPY . .

RUN npm run build

EXPOSE 8080
CMD [ "node", "build/index.js" ]
