import express from "express";
import { getClientProfile } from "../controllers/client.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:nameOrig", verifyToken, getClientProfile);

export default router;
