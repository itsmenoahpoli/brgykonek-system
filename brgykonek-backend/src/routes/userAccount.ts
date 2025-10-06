import express from "express";
import {
  disableAccount,
  enableAccount,
  getAccountStatus,
  getDisabledAccounts,
} from "../controllers/userAccountController";
import { authenticateToken } from "../middleware/auth";
import { isAdmin } from "../middleware/admin";

const router = express.Router();

// Get account status by user ID
router.get("/status/:userId", authenticateToken, isAdmin, getAccountStatus);

// Get all disabled accounts
router.get("/disabled", authenticateToken, isAdmin, getDisabledAccounts);

// Disable user account
router.post("/disable", authenticateToken, isAdmin, disableAccount);

// Enable user account
router.post("/enable", authenticateToken, isAdmin, enableAccount);

export default router;
