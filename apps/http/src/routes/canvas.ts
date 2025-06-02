import { Router } from "express";
import { createCanvas, getExistingShapes, getRoomIdFromSlug } from "../controllers/canvas";
import { authMiddleware } from "../middleware/auth";
const router = Router();

router.route("/").post(authMiddleware, createCanvas);
router.route("/:slug").get(getRoomIdFromSlug);
router.route("/shapes/:roomId").get(getExistingShapes);

export default router;