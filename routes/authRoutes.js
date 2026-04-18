import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  adminDashboard,
  getAllUsers,
  updateUserCredits,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);

router.get("/profile", protect, getProfile);

router.get("/users", protect, getAllUsers);
router.put("/credits", protect, updateUserCredits);

// 👑 ADMIN ROUTE
router.get("/admin", protect, adminOnly, adminDashboard);

export default router;