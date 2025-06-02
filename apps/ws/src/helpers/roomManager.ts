import { User } from "../types/types";

export function getUsersInRoom(users: User[], roomId: string) {
    let usersInRoom: User[] = [];

    users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
            usersInRoom.push(user);
        }
    })
    return usersInRoom;
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