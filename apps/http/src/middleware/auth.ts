import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization;

        if (!token) {
            res.status(411).json({ message: "JWT token is required." });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        if (typeof decoded === "string") {
            res.status(411).json({ message: "Invalid token." });
            return;
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(500).json({ message: "Error while decoding JWT token.", error });
    }
}