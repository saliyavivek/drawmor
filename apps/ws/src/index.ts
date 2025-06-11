import dotenv from "dotenv"
dotenv.config();

import express from "express";
import { WebSocketServer } from "ws";
import { validateUser } from "./utils/validate";
import { User } from "./types/types";
import { handleDrawShape, handleJoinRoom, handleChatMessage, handleUpdateShape, handleleaveRoom } from "./helpers/handlers";

const app = express();
const PORT = Number(process.env.PORT) || 8080;

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

const wss = new WebSocketServer({ server });

let users: User[] = [];

app.get("/ping", (req, res) => {
    res.status(200).send("pong");
});

wss.on("connection", (socket, request) => {
    const url = request.url;

    if (!url) {
        socket.close();
        return;
    }
    const user = validateUser(url, socket, users);

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