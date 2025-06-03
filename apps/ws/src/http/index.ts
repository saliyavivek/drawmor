import { WSMessage } from "../types/types";
import { prismaClient } from "@repo/db/prisma"

export async function insertRectangleInDB(parsedMessage: WSMessage, userId: string) {
    try {
        const payload = parsedMessage.payload;
        const shape = JSON.parse(payload.shape);

        await prismaClient.drawingElement.create({
            data: {
                type: shape.type,
                data: JSON.stringify({
                    x: shape.x,
                    y: shape.y,
                    width: shape.width,
                    height: shape.height
                }),
                roomId: payload.roomId,
                userId
            }
        })
    } catch (error) {
        console.error("error while inserting rectangle into db.", error);
    }
}

export async function insertCircleInDB(parsedMessage: WSMessage, userId: string) {
    try {
        const payload = parsedMessage.payload;
        const shape = JSON.parse(payload.shape);

        await prismaClient.drawingElement.create({
            data: {
                type: "circle",
                data: JSON.stringify({
                    x: shape.x,
                    y: shape.y,
                    radius: shape.radius
                }),
                roomId: payload.roomId,
                userId
            }
        })
    } catch (error) {
        console.error("error while inserting circle into db.", error);
    }
}

export async function insertLineInDB(parsedMessage: WSMessage, userId: string) {
    try {
        const payload = parsedMessage.payload;
        const shape = JSON.parse(payload.shape);

        await prismaClient.drawingElement.create({
            data: {
                type: "line",
                data: JSON.stringify({
                    startX: shape.startX,
                    startY: shape.startY,
                    endX: shape.endX,
                    endY: shape.endY
                }),
                roomId: payload.roomId,
                userId
            }
        })
    } catch (error) {
        console.error("error while inserting circle into db.", error);
    }
}