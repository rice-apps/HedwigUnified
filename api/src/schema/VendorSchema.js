import { VendorTC } from "../models/VendorModel";
import { PeriodTC } from "../models/CommonModels";

VendorTC.addFields({
    periods: {
        type: [PeriodTC],
        args: {
            // Probably don't need args here just yet
        },
        resolve: (source, args, context, info) => {
            // If we had args, we'd extract them up here

            // We want to use the parent (source)'s Square Merchant Id and their Location Id; so let's fetch it up here
            let {} = source;

            // Using their location Id, we can now make an API call with square
            // Check how ProductSchema uses the Square API

            // Step 1: Make Square Request for retrieveLocation
            // https://developer.squareup.com/reference/square/locations-api/retrieve-location

            // To get a better look at the data you'll be working with, save it to a file and then open the file
            // await fs.writeFile('example_location.json', JSON.stringify(<YOUR RESPONSE VARIABLE NAME HERE>), {}, () => console.log("Hi"));

            // Step 2: From the response, just take what we need (business_hours > periods)
            // Once we do this, we can just reformat each of these periods that we get back (using a map function) into our common data model

            // Step 3: Return the list of periods in the common data model format!
            return [
                {
                    start: 1,
                    end: 2,
                    day: "F",
                },
            ];
        },
    },
});

const VendorQueries = {
    getVendor: VendorTC.getResolver("findOne"),
    getVendors: VendorTC.getResolver("findMany"),
};

const VendorMutations = {
    // createVendor: VendorTC.getResolver("createOne"),
    updateVendor: VendorTC.getResolver("updateOne"),
};

export { VendorQueries, VendorMutations };
