import { Router } from "express";
import { createCanvas, getExistingShapes, getRoomIdFromSlug, getRoomSuggestions } from "../controllers/canvas";
import { authMiddleware } from "../middleware/auth";
const router = Router();

router.route("/").post(authMiddleware, createCanvas);
router.route("/:slug").post(authMiddleware, getRoomIdFromSlug);
router.route("/shapes/:roomId").get(authMiddleware, getExistingShapes);
// router.route("/check/:slug").get(authMiddleware, checkIsPasswordProtected);
router.route("/search/suggestions").get(authMiddleware, getRoomSuggestions);

export default router;