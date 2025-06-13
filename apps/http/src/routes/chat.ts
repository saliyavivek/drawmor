import { Router } from "express";
import { getExistingChats } from "../controllers/chat";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.route("/:roomId").get(authMiddleware, getExistingChats)

export default router;