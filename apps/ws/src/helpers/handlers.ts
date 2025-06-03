import { WebSocket } from "ws";
import { JWT_Payload, User, WSMessage } from "../types/types";
import { broadcastShape, broadcastUserList, getUsersInRoom } from "./roomManager";
import { insertRectangleInDB, insertCircleInDB, insertLineInDB } from "../http";

export function handleJoin(socket: WebSocket, parsedMessage: WSMessage, users: User[]) {
    const user = users.find(u => u.socket === socket);
    if (!user) {
        console.log("unable to join room. user doesn't found.");
        return;
    }
    user.rooms.push(parsedMessage.payload.roomId);

    const usersInRoom = getUsersInRoom(users, parsedMessage.payload.roomId);
    usersInRoom.forEach((u) => {
        u.socket.send(JSON.stringify({
            type: "join",
            payload: {
                userJoined: user.username
            }
        }));
    })

    broadcastUserList(users, parsedMessage.payload.roomId);
}

export function leaveRoom(socket: WebSocket, parsedMessage: WSMessage, users: User[]) {
    const user = users.find(u => u.socket === socket);
    if (!user) {
        console.log("unable to leave room. user doesn't found.");
        return;
    }
    user.rooms = user.rooms.filter(roomId => roomId !== parsedMessage.payload.roomId);

    const usersInRoom = getUsersInRoom(users, parsedMessage.payload.roomId);
    usersInRoom.forEach((u) => {
        u.socket.send(JSON.stringify({
            type: "leave",
            payload: {
                userLeft: user.username
            }
        }))
    })

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
    // type: "draw_shape",
    //    payload: {
    //        roomId,
    //        shape: JSON.stringify(shape),
    //        sender: userId
    //    }

    const payload = parsedMessage.payload;
    const usersInRoom = getUsersInRoom(users, payload.roomId);

    const shape = JSON.parse(payload.shape);

    switch (shape.type) {
        case "rectangle":
            await insertRectangleInDB(parsedMessage, currentUser.userId);

            broadcastShape(usersInRoom, shape, payload.roomId, currentUser);
            break;

        case "circle":
            await insertCircleInDB(parsedMessage, currentUser.userId);

            broadcastShape(usersInRoom, shape, payload.roomId, currentUser);
            break;

        case "line":
            await insertLineInDB(parsedMessage, currentUser.userId);

            broadcastShape(usersInRoom, shape, payload.roomId, currentUser);
            break;

        default:
            console.log("Can't draw the given shape.");
            break;
    }
}