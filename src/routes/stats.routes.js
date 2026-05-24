import express from "express";
import {getDashboardStats, getDSStats, getHistoryStats} from "../controllers/stats.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getDashboardStats);
router.get("/ds", verifyToken, getDSStats);
router.get("/history", verifyToken, getHistoryStats);
export default router;
