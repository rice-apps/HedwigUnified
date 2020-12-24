FROM node:12.14.1 as build-deps
WORKDIR /hedwig-app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD [ "node", "build/index.js" ]
