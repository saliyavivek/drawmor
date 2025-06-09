import prettifyError from "@repo/common/errors";
import { roomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/prisma";
import { Request, Response } from "express";

export async function createCanvas(req: Request, res: Response) {
    try {
        const userId = req.userId;

        if (!userId) {
            res.status(411).json({ message: "User id is requied." });
            return;
        }

        const parseResult = roomSchema.safeParse(req.body);

        if (!parseResult.success) {
            const errors = prettifyError(parseResult.error);
            res.status(411).json({ message: "Invalid input", errors });
            return;
        }

        const { name } = parseResult.data;

        const existingRoom = await prismaClient.room.findFirst({
            where: {
                name,
            }
        });

        if (existingRoom) {
            res.status(403).json({ message: "Room name is already taken." });
            return;
        }

        const room = await prismaClient.room.create({
            data: {
                name,
                adminId: userId,
            }
        })

        res.status(200).json({ message: "Room created.", roomId: room.id });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error })
    }
}

export async function getRoomIdFromSlug(req: Request, res: Response) {
    try {
        const slug = req.params.slug;
        const room = await prismaClient.room.findFirst({
            where: {
                name: slug
            }
        });

        if (!room) {
            res.status(403).json({ message: "Room doesn't exists." });
            return;
        }

        res.status(200).json({ name: slug, roomId: room.id });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error });
    }
}

export async function getExistingShapes(req: Request, res: Response) {
    try {
        const roomId = req.params.roomId;

        const room = await prismaClient.room.findFirst({
            where: {
                id: roomId
            }
        })
        if (!room) {
            res.status(403).json({ message: "Room doesn't exists." });
            return;
        }

        const shapes = await prismaClient.drawingElement.findMany({
            where: {
                roomId
            }
        });

        res.status(200).json({ roomId, shapes });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error });
    }
}