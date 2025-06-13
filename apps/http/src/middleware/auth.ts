import { NextFunction, Request, Response } from "express";
import { getToken } from "next-auth/jwt";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });

        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        req.userId = token.id as string;
        next();
    } catch (error) {
        res.status(500).json({ message: "Error while decoding token.", error });
    }
};
