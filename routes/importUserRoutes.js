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

router.put("/bulk/status", protect, adminOnly, bulkUpdateStatus);

// 🔄 UPDATE ONE
router.put("/:id/status", protect, adminOnly, updateImportUserStatus);

// 🔥 BULK UPDATE

export default router;