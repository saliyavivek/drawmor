import dotenv from "dotenv"
dotenv.config();

import { WebSocketServer } from "ws";
import { validateUser } from "./utils/validate";
import { User } from "./types/types";
import { handleDrawShape, handleJoin, handleMessage, leaveRoom } from "./helpers/handlers";

const wss = new WebSocketServer({ port: Number(process.env.PORT) });

let users: User[] = [];

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
                handleJoin(socket, parsedMessage, users);
                break;

            case "leave":
                leaveRoom(socket, parsedMessage, users);
                break;

            case "chat":
                handleMessage(parsedMessage, users, user!);
                break;

            case "draw_shape":
                handleDrawShape(parsedMessage, users, user!);
                break;

        }
    })

    socket.on("close", () => {
        users = users.filter((user) => user.socket !== socket);

        console.log(`${user!.username} disconnected.`);
    });
})

console.log(`web socket server listening to port ${process.env.PORT}.`);