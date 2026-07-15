import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  getMe,
  changePassword,
  updateDetails,
  deleteUser,
  updateEmailConfig,
  forgotPassword,
  resetPassword
} from "../controllers/user.controller.js";
import {
  githubAuth,
  githubCallback,
  googleAuth,
  googleCallback
} from "../controllers/oauth.controller.js";

const router = Router();

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshSession);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// OAuth Routes
router.get("/github", githubAuth);
router.get("/github/callback", githubCallback);
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

// Protected
router.post("/logout", verifyJWT, logoutUser);
router.get("/me", verifyJWT, getMe);
router.patch("/change-password", verifyJWT, changePassword);
router.patch("/update", verifyJWT, updateDetails);
router.patch("/email-config", verifyJWT, updateEmailConfig);
router.delete("/delete", verifyJWT, deleteUser);

export default router;


