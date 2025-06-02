import { WebSocket } from "ws";
import { JWT_Payload, User, WSMessage } from "../types/types";
import { broadcastUserList, getUsersInRoom } from "./roomManager";
import { insertShapeInDB } from "../http";

export function handleJoin(socket: WebSocket, parsedMessage: WSMessage, users: User[]) {
    const user = users.find(u => u.socket === socket);
    if (!user) {
        console.log("unable to join room. user doesn't found.");
        return;
    }
    user.rooms.push(parsedMessage.payload.roomId);
    broadcastUserList(users, parsedMessage.payload.roomId);
}

export function leaveRoom(socket: WebSocket, parsedMessage: WSMessage, users: User[]) {
    const user = users.find(u => u.socket === socket);
    if (!user) {
        console.log("unable to leave room. user doesn't found.");
        return;
    }
    user.rooms = user.rooms.filter(roomId => roomId !== parsedMessage.payload.roomId);
    broadcastUserList(users, parsedMessage.payload.roomId);
}

export function handleMessage(parsedMessage: WSMessage, users: User[], currentUser: JWT_Payload) {
    const usersInRoom = getUsersInRoom(users, parsedMessage.payload.roomId);

    usersInRoom.forEach((user) => {
        user.socket.send(JSON.stringify({
            type: "chat",
            payload: {
                message: parsedMessage.payload.message,
                roomId: parsedMessage.payload.roomId,
                sender: currentUser.username
            }
        }))
    })
}

export async function handleDrawShape(parsedMessage: WSMessage, users: User[], currentUser: JWT_Payload) {
    const payload = parsedMessage.payload;
    const usersInRoom = getUsersInRoom(users, payload.roomId);

    const shape = JSON.parse(payload.shape);

    switch (shape.type) {
        case "rectangle":
            await insertShapeInDB(parsedMessage, currentUser.userId);

            usersInRoom.forEach((user) => {
                user.socket.send(JSON.stringify({
                    type: "draw_shape",
                    payload: {
                        roomId: payload.roomId,
                        shape,
                        sender: currentUser.username
                    }
                }))
            })
            break;
    }
}