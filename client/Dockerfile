# syntax=docker/dockerfile:1.2
FROM node:12.20.0-alpine AS build
WORKDIR /hedwig-client
COPY package.json /hedwig-client
COPY package-lock.json /hedwig-client
RUN npm install
COPY . /hedwig-client
RUN --mount=type=secret,id=REACT_APP_FIREBASE_API_KEY \
    --mount=type=secret,id=REACT_APP_AUTH_DOMAIN \
    REACT_APP_FIREBASE_API_KEY=$(cat /run/secrets/REACT_APP_FIREBASE_API_KEY) \
    REACT_APP_AUTH_DOMAIN=$(cat /run/secrets/REACT_APP_AUTH_DOMAIN) \
    npm run build
EXPOSE 3000
CMD ["npm", "start"]