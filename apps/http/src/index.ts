import dotenv from "dotenv";
dotenv.config();

import express from "express";
import userRouter from "./routes/user";
import canvasRouter from "./routes/canvas";
import chatRouter from "./routes/chat";
import cors from 'cors';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

const allowedOrigins = [
    process.env.CLIENT_ORIGIN!,
    "http://localhost:3000"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use("/api/user", userRouter);
app.use("/api/canvas", canvasRouter);
app.use("/api/chat", chatRouter)

app.get("/ping", (req, res) => {
    res.status(200).send("pong");
});

app.listen(PORT, () => console.log(`Server listening to port ${PORT}`));