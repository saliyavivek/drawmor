import { WebSocket } from "ws";
import { JWT_Payload, User, WSMessage } from "../types/types";
import { broadcastChat, broadcastJoinEvent, broadcastLeaveEvent, broadcastShape, broadcastUserList, getUsersInRoom } from "./roomManager";
import { updateShape, drawShape } from "../http";
import { insertChatInDB } from "../http/http";

export function handleJoinRoom(socket: WebSocket, parsedMessage: WSMessage, users: User[]) {
    const userJoined = users.find(u => u.socket === socket);
    if (!userJoined) {
        console.log("unable to join room. user doesn't found.");
        return;
    }
    userJoined.rooms.push(parsedMessage.payload.roomId);

    broadcastJoinEvent(users, parsedMessage.payload.roomId, userJoined);

    broadcastUserList(users, parsedMessage.payload.roomId);
}

export function handleleaveRoom(socket: WebSocket, parsedMessage: WSMessage, users: User[]) {
    const userLeft = users.find(u => u.socket === socket);
    if (!userLeft) {
        console.log("unable to leave room. user doesn't found.");
        return;
    }
    userLeft.rooms = userLeft.rooms.filter(roomId => roomId !== parsedMessage.payload.roomId);

    broadcastLeaveEvent(users, parsedMessage.payload.roomId, userLeft);

    broadcastUserList(users, parsedMessage.payload.roomId);
}

export async function handleChatMessage(parsedMessage: WSMessage, users: User[], currentUser: JWT_Payload) {
    const usersInRoom = getUsersInRoom(users, parsedMessage.payload.roomId);

    await insertChatInDB(parsedMessage);

    broadcastChat(usersInRoom, currentUser, parsedMessage);
}

export async function handleDrawShape(parsedMessage: WSMessage, users: User[], currentUser: JWT_Payload) {
    await drawShape(parsedMessage, users, currentUser);
}

export async function handleUpdateShape(parsedMessage: WSMessage, users: User[], currentUser: JWT_Payload) {
    await updateShape(parsedMessage, users, currentUser);
}