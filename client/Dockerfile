# syntax=docker/dockerfile:1.2
FROM node:lts-alpine AS build

WORKDIR /hedwig-client

COPY package.json /hedwig-client
COPY package-lock.json /hedwig-client

RUN npm install

COPY . /hedwig-client

ARG REACT_APP_SERVICE_URL
ARG REACT_APP_BACKEND_URL
ARG REACT_APP_GRAPHQL_URL
ARG REACT_APP_GRAPHQL_WS_URL

ENV REACT_APP_SERVICE_URL=${REACT_APP_SERVICE_URL:-http://localhost:3000/auth}
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL:-http://localhost:3001/api}
ENV REACT_APP_GRAPHQL_URL=${REACT_APP_GRAPHQL_URL:-http://localhost:3001/graphql}
ENV REACT_APP_GRAPHQL_WS_URL=${REACT_APP_GRAPHQL_WS_URL:-ws://localhost:3001/graphql}

RUN --mount=type=secret,id=REACT_APP_FIREBASE_API_KEY \
    --mount=type=secret,id=REACT_APP_AUTH_DOMAIN \
    REACT_APP_FIREBASE_API_KEY=$(cat /run/secrets/REACT_APP_FIREBASE_API_KEY) \
    REACT_APP_AUTH_DOMAIN=$(cat /run/secrets/REACT_APP_AUTH_DOMAIN) \
    npm run build

EXPOSE 3000

CMD ["npm", "start"]
