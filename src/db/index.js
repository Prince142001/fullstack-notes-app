import mongoose from "mongoose";
import { DB_USER } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_USER}`
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
