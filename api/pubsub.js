const { PubSub } = require("apollo-server");

// Initialize PubSub: https://www.apollographql.com/docs/apollo-server/data/subscriptions/
export const pubsub = new PubSub();
