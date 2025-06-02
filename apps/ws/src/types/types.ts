import { WebSocket } from "ws";

export interface User {
    userId: string;
    username: string;
    rooms: string[];
    socket: WebSocket;
}

export type MessageType = "join" | "leave";

export interface WSMessage {
    type: MessageType;
    payload: any;
}

export type JWT_Payload = {
    userId: string;
    username: string
}