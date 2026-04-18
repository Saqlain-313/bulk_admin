import express from "express";
import {
  getImportUsersAnalysis,
  updateImportUserStatus,
  bulkUpdateStatus,
} from "../controllers/importUserController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// 📊 ANALYSIS
router.get("/analysis", protect, adminOnly, getImportUsersAnalysis);

// 🔄 UPDATE ONE
router.put("/:id/status", protect, adminOnly, updateImportUserStatus);

// 🔥 BULK UPDATE
router.put("/bulk/status", protect, adminOnly, bulkUpdateStatus);

export default router;