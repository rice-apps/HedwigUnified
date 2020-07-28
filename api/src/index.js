import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import http from "http";
import log from "loglevel";

import { ALLOWED_ORIGINS, DEV_PORT } from "./config";

import "./utils/db";

const app = express().use(
    cors({
        origin: ALLOWED_ORIGINS,
        credentials: true,
    }),
);

const server = new ApolloServer();

server.applyMiddleware({ app });

const httpServer = http.createServer(app);

server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: DEV_PORT }, () => {
    log.info(
        `🚀 Server ready at http://localhost:${DEV_PORT}${server.graphqlPath}`,
    );
    log.info(
        `🚀 Subscriptions ready at http://localhost:${DEV_PORT}${server.subscriptionsPath}`,
    );
});
