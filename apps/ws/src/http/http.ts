import { prismaClient } from "@repo/db/prisma";
import { ArrowShape, CircleShape, LineShape, PencilShape, RectangleShape } from "@repo/common/types.js"
import { WSMessage } from "../types/types";

export async function insertRectangleInDB(shape: RectangleShape, userId: string, roomId: string) {
    try {
        await prismaClient.drawingElement.create({
            data: {
                id: shape.id,
                type: shape.type,
                data: JSON.stringify({
                    x: shape.x,
                    y: shape.y,
                    width: shape.width,
                    height: shape.height
                }),
                roomId,
                userId
            }
        })
    } catch (error) {
        console.error("error while inserting rectangle into db.", error);
    }
}

export async function insertCircleInDB(shape: CircleShape, userId: string, roomId: string) {
    try {
        await prismaClient.drawingElement.create({
            data: {
                id: shape.id,
                type: "circle",
                data: JSON.stringify({
                    x: shape.x,
                    y: shape.y,
                    radius: shape.radius
                }),
                roomId,
                userId
            }
        })
    } catch (error) {
        console.error("error while inserting circle into db.", error);
    }
}

export async function insertLineInDB(shape: LineShape, userId: string, roomId: string) {
    try {
        await prismaClient.drawingElement.create({
            data: {
                type: "line",
                data: JSON.stringify({
                    startX: shape.startX,
                    startY: shape.startY,
                    endX: shape.endX,
                    endY: shape.endY
                }),
                roomId,
                userId
            }
        })
    } catch (error) {
        console.error("error while inserting circle into db.", error);
    }
}

export async function insertPencilShapeInDB(shape: PencilShape, userId: string, roomId: string) {
    try {
        await prismaClient.drawingElement.create({
            data: {
                type: "pencil",
                data: JSON.stringify({
                    points: shape.points
                }),
                roomId,
                userId
            }
        })
    } catch (error) {
        console.error("error while inserting pencil shape into db.", error);
    }
}

export async function insertArrowShapeInDB(shape: ArrowShape, userId: string, roomId: string) {
    try {
        await prismaClient.drawingElement.create({
            data: {
                type: "arrow",
                data: JSON.stringify({
                    startX: shape.startX,
                    startY: shape.startY,
                    endX: shape.endX,
                    endY: shape.endY
                }),
                roomId,
                userId
            }
        })
    } catch (error) {
        console.error("error while inserting arrow shape into db.", error);
    }
}

export async function insertChatInDB(parsedMessage: WSMessage) {
    try {
        const payload = parsedMessage.payload;

        await prismaClient.chat.create({
            data: {
                text: payload.text,
                roomId: payload.roomId,
                senderId: payload.userId
            }
        })
    } catch (error) {
        console.error("error while inserting chat into db.", error);
    }
}

export async function updateRectangle(shape: RectangleShape) {
    try {
        await prismaClient.drawingElement.update({
            where: {
                id: shape.id
            },
            data: {
                data: JSON.stringify({
                    x: shape.x,
                    y: shape.y,
                    width: shape.width,
                    height: shape.height
                }),
            }
        });
    } catch (error) {
        console.error("error while updating rect into db.", error);
    }
}

export async function updateCircle(shape: CircleShape) {
    try {
        await prismaClient.drawingElement.update({
            where: {
                id: shape.id
            },
            data: {
                data: JSON.stringify({
                    x: shape.x,
                    y: shape.y,
                    radius: shape.radius,
                })
            }
        })
    } catch (error) {
        console.error("error while updating circle into db.", error);
    }
}