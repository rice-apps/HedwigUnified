import { User, UserTC } from '../models';

const AuthQuery = {
    verifyUser: UserTC.getResolver("verify")
};

const AuthMutation = {
    authenticateUser: UserTC.getResolver("authenticate"),
};

export { AuthQuery, AuthMutation };