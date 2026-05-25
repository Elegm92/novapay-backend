import express from "express";
import { loginUser, me, logoutUser, updateProfile } from "../controllers/auth.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.get("/me", verifyToken, me);
router.post("/logout", verifyToken, logoutUser);
router.patch("/profile", verifyToken, updateProfile);

export default router;
