import { JWT_Payload, User, WSMessage } from "../types/types";

export function getUsersInRoom(users: User[], roomId: string) {
    let usersInRoom: User[] = [];

    users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
            usersInRoom.push(user);
        }
    })
    return usersInRoom;
}

export const broadcastJoinEvent = (users: User[], roomId: string, userJoined: JWT_Payload) => {
    const usersInRoom = getUsersInRoom(users, roomId);
    usersInRoom.forEach((u) => {
        u.socket.send(JSON.stringify({
            type: "join",
            payload: {
                userJoined: userJoined.username
            }
        }));
    })
}

export const broadcastLeaveEvent = (users: User[], roomId: string, userLeft: JWT_Payload) => {
    const usersInRoom = getUsersInRoom(users, roomId);
    usersInRoom.forEach((u) => {
        u.socket.send(JSON.stringify({
            type: "leave",
            payload: {
                userLeft: userLeft.username
            }
        }))
    })
}

export const broadcastUserList = (users: User[], roomId: string) => {
    const usersInRoom = getUsersInRoom(users, roomId);
    const usernames = usersInRoom.map((user) => user.username);
    usersInRoom.forEach((user) =>
        user.socket.send(
            JSON.stringify({
                type: "user_list",
                payload: {
                    users: usernames,
                },
            })
        )
    );
};

export const broadcastShape = (usersInRoom: User[], shape: JSON, roomId: string, currentUser: JWT_Payload, type: "draw_shape" | "update_shape") => {
    usersInRoom.forEach((user) => {
        user.socket.send(JSON.stringify({
            type,
            payload: {
                roomId: roomId,
                shape,
                sender: currentUser
            }
        }))
    })
}

export const broadcastChat = (usersInRoom: User[], currentUser: JWT_Payload, parsedMessage: WSMessage) => {
    usersInRoom.forEach((user) => {
        user.socket.send(JSON.stringify({
            type: "chat",
            payload: {
                userId: currentUser.userId,
                text: parsedMessage.payload.text,
                sender: currentUser.username,
                timestamp: Date.now()
            }
        }))
    })
}