import { broadcastShape, getUsersInRoom } from "../helpers/roomManager";
import { WSMessage, User, JWT_Payload } from "../types/types";
import { insertArrowShapeInDB, insertCircleInDB, insertLineInDB, insertPencilShapeInDB, insertRectangleInDB, insertTextShapeInDB, updateCircle, updateRectangle } from "./http";

export async function drawShape(parsedMessage: WSMessage, users: User[], currentUser: JWT_Payload) {
    const shape = JSON.parse(parsedMessage.payload.shape);
    const roomId = parsedMessage.payload.roomId;
    const usersInRoom = getUsersInRoom(users, parsedMessage.payload.roomId);

    switch (shape.type) {
        case "rectangle":
            await insertRectangleInDB(shape, currentUser.userId, roomId);
            break;

        case "circle":
            await insertCircleInDB(shape, currentUser.userId, roomId);
            break;

        case "line":
            await insertLineInDB(shape, currentUser.userId, roomId);
            break;

        case "pencil":
            await insertPencilShapeInDB(shape, currentUser.userId, roomId);
            break;

        case "arrow":
            await insertArrowShapeInDB(shape, currentUser.userId, roomId);
            break;

        case "text":
            await insertTextShapeInDB(shape, currentUser.userId, roomId);
            break;

        default:
            console.log("Can't draw the given shape.");
            break;
    }
    broadcastShape(usersInRoom, shape, roomId, currentUser, "draw_shape");
}

export async function updateShape(parsedMessage: WSMessage, users: User[], currentUser: JWT_Payload) {
    const shape = JSON.parse(parsedMessage.payload.shape);

    switch (shape.type) {
        case "rectangle":
            await updateRectangle(shape);
            break;

        case "circle":
            await updateCircle(shape);
            break;

        default:
            console.log("Can't update the given shape.");
            break;

    }
    broadcastShape(users, shape, parsedMessage.payload.roomId, currentUser, "update_shape")
}