import { Location, LocationTC } from '../models';

const LocationQuery = {
    locationOne: LocationTC.getResolver('findOne')
};

const LocationMutation = {
    locationCreateOne: LocationTC.getResolver('createOne')
};

export { LocationQuery, LocationMutation };