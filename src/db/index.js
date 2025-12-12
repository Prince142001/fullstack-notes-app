import mongoose from "mongoose";
import constants from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${constants}`
        );
        console.log(
            "MongoDB connected | Connection host: ",
            connectionInstance.connection.host
        );
    } catch (error) {
        console.error("MongoDB connection failed", error);
        process.exit(1);
    }
};

export { connectDB };
