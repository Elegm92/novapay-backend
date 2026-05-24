import express from "express";
import { getQueue } from "../controllers/transaction.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getQueue);

export default router;
