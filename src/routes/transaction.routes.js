import express from "express";
import {
  getQueue,
  getTransactionById,
} from "../controllers/transaction.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getQueue);
router.get("/:id", verifyToken, getTransactionById);

export default router;
