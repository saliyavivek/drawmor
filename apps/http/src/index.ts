import dotenv from "dotenv";
dotenv.config();

import express from "express";
import userRouter from "./routes/user";
import canvasRouter from "./routes/canvas";
import cors from 'cors';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/canvas", canvasRouter);

app.listen(PORT, () => console.log(`Server listening to port ${PORT}`));