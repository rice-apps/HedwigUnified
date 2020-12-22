FROM node:12.14.1 as build-deps
ENV NODE_ENV=production
WORKDIR /hedwig-app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 3001
CMD [ "node", "build/index.js" ]
