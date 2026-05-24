import express from "express";
import { decide, challenge, feedback, preview } from "../controllers/fraud.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/decide", verifyToken, decide);
router.post("/challenge", verifyToken, challenge);
router.post("/feedback", verifyToken, feedback);
router.post("/preview", verifyToken, preview);

export default router;