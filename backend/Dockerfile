# syntax=docker/dockerfile:1.2
FROM node:15-alpine3.13

RUN apk add --no-cache tini=~0.19.0

WORKDIR /backend

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 8080

USER node

ENTRYPOINT ["/sbin/tini", "--"]
CMD [ "node", "src/index.js" ]
