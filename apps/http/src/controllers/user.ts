import { Request, Response } from "express";
import { authSchema } from "@repo/common/schema"
import prettifyError from "@repo/common/errors"
import jwt from "jsonwebtoken";
import { prismaClient } from "@repo/db/prisma"
import bcrypt from "bcrypt";

export async function signup(req: Request, res: Response) {
    try {
        const parsedResult = authSchema.safeParse(req.body);
        if (!parsedResult.success) {
            const errors = prettifyError(parsedResult.error);
            res.status(411).json({ message: "Invalid input", errors });
            return;
        }

        const { username, password } = parsedResult.data;

        const existingUser = await prismaClient.user.findFirst({
            where: {
                username
            }
        })

        if (existingUser) {
            res.status(403).json({ message: "User already exists. Please log in." });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prismaClient.user.create({
            data: {
                username,
                password: hashedPassword
            }
        });

        const token = jwt.sign({
            userId: user.id,
            username: user.username
        }, process.env.JWT_SECRET!);

        res.json({ message: "User registered.", id: user.id, token })
    } catch (error) {
        res.status(500).json({ message: "Server error.", error })
    }
}

export async function signin(req: Request, res: Response) {
    try {
        const parsedResult = authSchema.safeParse(req.body);
        if (!parsedResult.success) {
            const errors = prettifyError(parsedResult.error);
            res.status(411).json({ message: "Invalid input", errors });
            return;
        }

        const { username, password } = parsedResult.data;

        const existingUser = await prismaClient.user.findFirst({
            where: {
                username
            }
        })

        if (!existingUser) {
            res.status(403).json({ message: "User doesn't exists. Please sign up." });
            return;
        }

        const match = await bcrypt.compare(password, existingUser.password);

        if (!match) {
            res.status(411).json({ message: "Incorrect password." });
            return;
        }

        const token = jwt.sign({
            userId: existingUser.id,
            username: existingUser.username
        }, process.env.JWT_SECRET!);

        res.json({ message: "User logged in.", id: existingUser.id, token })
    } catch (error) {
        res.status(500).json({ message: "Server error.", error })
    }
}