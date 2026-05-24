import express from "express";
import { getDashboardStats, getDSStats } from "../controllers/stats.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getDashboardStats);
router.get("/ds", verifyToken, getDSStats);

export default router;
