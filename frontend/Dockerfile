# syntax=docker/dockerfile:1.2

# build environment
FROM node:lts-alpine AS build

WORKDIR /frontend

COPY package*.json ./

RUN npm ci --only=production

COPY . .

ARG REACT_APP_GRAPHQL_URL
ARG REACT_APP_GRAPHQL_WS_URL

ENV REACT_APP_GRAPHQL_URL=${REACT_APP_GRAPHQL_URL:-http://localhost:3001/graphql}
ENV REACT_APP_GRAPHQL_WS_URL=${REACT_APP_GRAPHQL_WS_URL:-ws://localhost:3001/ws}

RUN --mount=type=secret,id=REACT_APP_FIREBASE_API_KEY \
    --mount=type=secret,id=REACT_APP_AUTH_DOMAIN \
    REACT_APP_FIREBASE_API_KEY=$(cat /run/secrets/REACT_APP_FIREBASE_API_KEY) \
    REACT_APP_AUTH_DOMAIN=$(cat /run/secrets/REACT_APP_AUTH_DOMAIN) \
    npm run build

# production environment

FROM nginx:mainline-alpine

COPY --from=build /frontend/build /var/www/html

RUN chown -R nginx:nginx /var/www/html

EXPOSE 8000 8001
USER nginx
CMD ["nginx", "-g", "daemon off;"]
