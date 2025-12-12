import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import express from "express";

const app = express();

dotenv.config({
    path: "./env",
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`App is listen on PORT ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed!!", error);
    });
