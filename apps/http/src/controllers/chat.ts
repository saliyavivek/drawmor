import { prismaClient } from "@repo/db/prisma";
import { Request, Response } from "express";

export async function getExistingChats(req: Request, res: Response) {
    try {
        const { roomId } = req.params;

        const chats = await prismaClient.chat.findMany({
            where: {
                roomId
            },
            include: {
                sender: {
                    select: {
                        username: true,
                    }
                }
            }
        })

        const formattedChats = chats.map(chat => ({
            userId: chat.senderId,
            text: chat.text,
            sender: chat.sender.username,
            timestamp: chat.createdAt
        }));

        res.status(200).json({ chats: formattedChats, roomId });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error });
    }
}