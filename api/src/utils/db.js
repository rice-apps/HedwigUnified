import log from "loglevel";
import mongoose from "mongoose";

import { MONGODB_URL, MONGOOSE_CONFIG } from "../config";

try {
    mongoose.connect(MONGODB_URL, MONGOOSE_CONFIG);
} catch (err) {
    log.error(err);
} finally {
    mongoose.connection.on("connected", () => {
        log.info("Mongoose connected to MongoDB server!");
    });
}
