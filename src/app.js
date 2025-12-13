import express from "express";
import userRouter from "./routes/user.route.js";
import cors from "cors";
const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        Credential: true,
    })
);

app.use(express.json({ limit: "16kb" }));

app.use("/api/v1/users", userRouter);

export default app;
