import jwt from "jsonwebtoken";
import { getToken } from "./get-token";
import { WebSocket } from "ws";
import { User } from "../types/types";

export function validateUser(url: string, socket: WebSocket, users: User[]) {
    const token = getToken(url);

    if (!token) {
        console.log("token is required.");
        socket.close();
        return;
    };

    const user = helper(token);
    if (!user) {
        socket.close();
        return;
    }

    users.push({
        userId: user.userId,
        rooms: [],
        socket,
        username: user.username
    });

    return user;
}

function helper(token: string) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        if (typeof decoded === "string") {
            console.log("invalid token");
            return;
        }

        return { userId: decoded.userId, username: decoded.username };
    } catch (error) {
        console.log('Server error.', error);
    }
}