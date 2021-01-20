# syntax=docker/dockerfile:1.2
FROM node:lts-alpine as build

WORKDIR /backend

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN apk add --no-cache tini=~0.18.0

EXPOSE 8080

USER node

ENTRYPOINT ["/sbin/tini", "--"]
CMD [ "node", "src/index.js" ]
