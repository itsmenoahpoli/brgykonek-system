import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import * as notificationController from "../controllers/notificationController";

const router = Router();

router.get("/", authenticateToken, notificationController.getNotifications);
router.put("/:id/read", authenticateToken, notificationController.markAsRead);
router.put("/mark-all-read", authenticateToken, notificationController.markAllAsRead);

export default router;


