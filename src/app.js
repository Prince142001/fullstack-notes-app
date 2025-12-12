import express from "express";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        Credential: true,
    })
);

app.use(express.json({ limit: "16kb" }));
