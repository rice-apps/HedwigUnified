import { SchemaComposer } from 'graphql-compose';

require('../db'); 

const schemaComposer = new SchemaComposer();

import { UserQuery, UserMutation } from './UserSchema';
import { AuthQuery, AuthMutation } from './AuthSchema';

schemaComposer.Query.addFields({
    ...UserQuery,
    ...AuthQuery
});

schemaComposer.Mutation.addFields({
    ...UserMutation,
    ...AuthMutation
});

schemaComposer.Subscription.addFields({
    // If we have any subscriptions, we just import them in the same way
})

export default schemaComposer.buildSchema();