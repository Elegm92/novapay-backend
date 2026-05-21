import express from "express";
import { getDashboardStats } from "../controllers/stats.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getDashboardStats);

export default router;
