import { PubSub } from "apollo-server-express";

// Initialize PubSub: https://www.apollographql.com/docs/apollo-server/data/subscriptions/
const pubsub = new PubSub();

export default pubsub;
