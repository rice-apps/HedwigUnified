FROM node:12.20.0-alpine AS build

WORKDIR /hedwig-client

COPY package.json /hedwig-client

RUN npm install

COPY . /hedwig-client

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]