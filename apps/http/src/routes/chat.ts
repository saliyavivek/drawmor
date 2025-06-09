import { Router } from "express";
import { getExistingChats } from "../controllers/chat";

const router = Router();

router.route("/:roomId").get(getExistingChats)

export default router;