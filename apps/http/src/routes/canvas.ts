import { Router } from "express";
import { createCanvas, getExistingShapes, getRoomIdFromSlug } from "../controllers/canvas";
import { authMiddleware } from "../middleware/auth";
const router = Router();

router.route("/").post(authMiddleware, createCanvas);
router.route("/:slug").get(authMiddleware, getRoomIdFromSlug);
router.route("/shapes/:roomId").get(authMiddleware, getExistingShapes);

export default router;