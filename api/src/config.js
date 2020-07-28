import "dotenv/config";
import log from "loglevel";

if (process.env.NODE_ENV === "development") {
    log.setLevel("trace");
}

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS.split(",");
const DEV_PORT = parseInt(process.env.DEV_PORT, 10);
const { MONGODB_URL, SQUARE_ACCESS_TOKEN } = process.env;

const MONGOOSE_CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
};

export {
    ALLOWED_ORIGINS,
    DEV_PORT,
    MONGODB_URL,
    MONGOOSE_CONFIG,
    SQUARE_ACCESS_TOKEN,
};
