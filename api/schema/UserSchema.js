import { User, UserTC } from '../models';
import { authenticateTicket, verifyToken, createToken } from '../utils/authenticationUtils';

/**
 * Custom Resolvers
 */

/**
 * Authentication-related resolvers
 */

UserTC.addResolver({
    name: "authenticate",
    type: UserTC,
    args: { ticket: "String!" },
    resolve: async ({ source, args, context, info }) => {
        let authenticationResponse = await authenticateTicket(args.ticket);
        if (authenticationResponse.success) {
            let user; // this will be used as the return object

            // Get the netid of the authenticated user
            let { netid } = authenticationResponse;

            // Check if user exists based on netid
            let exists = await User.exists({ netid: netid });
            if (!exists) {
                // Create user
                user = await User.create({ netid: netid });
            } else {
                user = await User.findOne({ netid: netid });
            }

            // Get a new token for the user
            let token = createToken(user);

            // Update the user's token and get their updated information
            return await User.findByIdAndUpdate(user._id, { token: token }, { new: true });
        } else {
            console.log("Bad auth!");
            throw Error("Bad authentication.");
        }
    }
});

UserTC.addResolver({
    name: "verify",
    type: UserTC,
    args: { token: UserTC.getFieldTC("token") },
    resolve: async ({ source, args, context, info }) => {
        let verificationResponse = await verifyToken(args.token);
        if (verificationResponse.success) {
            let { id } = verificationResponse;
            // Return logged in user's info
            return await User.findById(id);
        } else {
            console.log("Bad verify!");
            throw Error("Bad Verification.");
        }
    }
})

// Using auth middleware for sensitive info: https://github.com/graphql-compose/graphql-compose-mongoose/issues/158
const UserQuery = {
    userOne: UserTC.getResolver('findOne', [authMiddleware]),
};

const UserMutation = {
    userUpdateOne: UserTC.getResolver('updateOne', [authMiddleware]),
};

async function authMiddleware(resolve, source, args, context, info) {
    // Without header, throw error
    if (!context.decodedJWT) {
        throw new Error("You need to be logged in.");
    }

    // Pull out unique MongoDB User id (not the netid) from decoded JWT 
    let { id } = context.decodedJWT;

    // Allows a user to only access THEIR user object, while maintaining any other filters/args they might have requested
    return resolve(source, {...args, filter: {...args.filter, _id: id } }, context, info);
}

export { UserQuery, UserMutation };