import prettifyError from "@repo/common/errors";
import { roomSchema } from "@repo/common/schema";
import { prismaClient } from "@repo/db/prisma";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

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

        const { name, password, isPrivate } = parseResult.data;

        const existingRoom = await prismaClient.room.findFirst({
            where: {
                name,
            }
        });

        if (existingRoom) {
            res.status(403).json({ message: "Room name is already taken." });
            return;
        }

        let hashedPassword;
        if (password !== "") {
            hashedPassword = await bcrypt.hash(password!, 10);
        }

        const room = await prismaClient.room.create({
            data: {
                name,
                adminId: userId,
                isPrivate,
                password: password !== "" ? hashedPassword : null
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

        const { password } = req.body;

        const room = await prismaClient.room.findFirst({
            where: { name: slug },
            include: {
                admin: {
                    select: { username: true }
                }
            }
        });

        if (!room) {
            res.status(403).json({ message: "Room doesn't exists." });
            return;
        }

        if (room.isPrivate) {
            if (!password) {
                res.status(400).json({ message: "Password required to join private room." });
                return;
            }

            const passwordMatches = await bcrypt.compare(password, room.password!);

            if (!passwordMatches) {
                res.status(400).json({ message: "Incorrect password." });
                return;
            }
        }

        res.status(200).json({ name: slug, roomId: room.id, admin: room.admin.username });
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

// export async function checkIsPasswordProtected(req: Request, res: Response) {
//     try {
//         const slug = req.params.slug;

//         const room = await prismaClient.room.findFirst({
//             where: {
//                 name: slug
//             }
//         });
//         if (!room) {
//             res.status(403).json({ message: "Room doesn't exists." });
//             return;
//         }

//         res.status(200).json({ roomId: room.id, isPrivate: room.isPrivate });

//     } catch (error) {
//         res.status(500).json({ message: "Server error.", error });
//     }
// }

export const getRoomSuggestions = async (req: Request, res: Response) => {
    try {
        const query = (req.query.query as string || "").trim().toLowerCase();

        if (!query || query.length < 1) {
            res.status(400).json({ error: "Query is required." });
            return;
        }

        const suggestions = await prismaClient.room.findMany({
            where: {
                name: {
                    startsWith: query
                }
            },
            select: {
                name: true,
                isPrivate: true
            }
        })

        res.status(200).json(suggestions);

    } catch (error) {
        console.error("Error fetching suggestions:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};
