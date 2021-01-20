# syntax=docker/dockerfile:1.2
FROM node:lts-alpine as build

WORKDIR /backend

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 8080
USER node
ENTRYPOINT ["tini", "--"]
CMD [ "node", "src/index.js" ]
