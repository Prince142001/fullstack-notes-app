import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import noteRouter from "./routes/note.route.js";
import cors from "cors";
const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);

app.use("/api/v1/notes", noteRouter);

export default app;
