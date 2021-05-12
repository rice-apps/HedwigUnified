# syntax=docker/dockerfile:1.2

# build environment
FROM node:16.1-alpine3.13 AS build

WORKDIR /frontend

COPY package*.json ./

RUN npm ci --only=production

COPY . .

ARG REACT_APP_GRAPHQL_URL
ARG REACT_APP_GRAPHQL_WS_URL
ARG REACT_APP_HEDWIG_VENDOR_PERMISSIONS

ENV REACT_APP_GRAPHQL_URL=${REACT_APP_GRAPHQL_URL:-http://localhost:3001/graphql}
ENV REACT_APP_GRAPHQL_WS_URL=${REACT_APP_GRAPHQL_WS_URL:-ws://localhost:3001/ws}
ENV REACT_APP_HEDWIG_VENDOR_PERMISSIONS=${REACT_APP_HEDWIG_VENDOR_PERMISSIONS:-ITEMS_READ;PAYMENTS_WRITE}

RUN --mount=type=secret,id=REACT_APP_AUTH_DOMAIN \
    --mount=type=secret,id=REACT_APP_FIREBASE_API_KEY \
    --mount=type=secret,id=REACT_APP_SQUARE_CLIENT_ID \
    REACT_APP_AUTH_DOMAIN=$(cat /run/secrets/REACT_APP_AUTH_DOMAIN) \
    REACT_APP_FIREBASE_API_KEY=$(cat /run/secrets/REACT_APP_FIREBASE_API_KEY) \
    REACT_APP_SQUARE_CLIENT_ID=$(cat /run/secrets/REACT_APP_SQUARE_CLIENT_ID) \
    npm run build

# production environment

FROM nginx:mainline-alpine

COPY --from=build /frontend/build /var/www/html

EXPOSE 80 443
USER nginx
CMD ["nginx", "-g", "daemon off;"]
