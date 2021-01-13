# syntax=docker/dockerfile:1.2
FROM node:12.20.0-alpine3.11 as build-deps
WORKDIR /hedwig-app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8080
CMD [ "node", "build/index.js" ]