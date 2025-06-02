import { WSMessage } from "../types/types";
import { prismaClient } from "@repo/db/prisma"

export async function insertShapeInDB(parsedMessage: WSMessage, userId: string) {
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
        console.error("error while inserting shape into db.", error);
    }
}