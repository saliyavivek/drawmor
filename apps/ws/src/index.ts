import dotenv from "dotenv"
dotenv.config();

import express from "express";
import { WebSocketServer } from "ws";
import { User } from "./types/types";
import { handleDrawShape, handleJoinRoom, handleChatMessage, handleUpdateShape, handleleaveRoom } from "./helpers/handlers";
import cors from "cors";
import * as cookie from "cookie";
import { getToken } from "next-auth/jwt";

const app = express();
const PORT = Number(process.env.PORT) || 8080;

const allowedOrigins = [
    process.env.CLIENT_ORIGIN!,
    "http://localhost:3000"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

const wss = new WebSocketServer({ server });

let users: User[] = [];

app.get("/ping", (req, res) => {
    res.status(200).send("pong");
});

wss.on("connection", async (socket, req) => {
    const cookies = cookie.parse(req.headers.cookie || "");

    const token =
        cookies["next-auth.session-token"] || cookies["__Secure-next-auth.session-token"];

    if (!token) {
        socket.close();
        return;
    }

    const fakeReq = {
        headers: req.headers,
        cookies, // required for getToken to avoid TS error
    } as unknown as any;

    const decodedToken = await getToken({
        req: fakeReq,
        secret: process.env.NEXTAUTH_SECRET,
    });

    if (!decodedToken) {
        socket.close();
        return;
    }

    const user = {
        userId: decodedToken.id as string,
        username: decodedToken.username as string
    }

    users.push({
        userId: user.userId,
        username: user.username,
        rooms: [],
        socket
    })

    console.log(`${user!.username} connected`);

    socket.on("message", (data) => {
        const parsedMessage = JSON.parse(data.toString());

        switch (parsedMessage.type) {
            case "join":
                handleJoinRoom(socket, parsedMessage, users);
                break;

            case "leave":
                handleleaveRoom(socket, parsedMessage, users);
                break;

            case "chat":
                handleChatMessage(parsedMessage, users, user!);
                break;

            case "draw_shape":
                handleDrawShape(parsedMessage, users, user!);
                break;

            case "update_shape":
                handleUpdateShape(parsedMessage, users, user!);
                break;
        }
    })

    socket.on("close", () => {
        users = users.filter((user) => user.socket !== socket);

        console.log(`${user!.username} disconnected.`);
    });
})

console.log(`web socket server listening to port ${process.env.PORT}.`);