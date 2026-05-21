import express from 'express'
import { createDecision, getDecisions } from '../controllers/decision.controller.js'
import verifyToken from '../middlewares/auth.middleware.js'

const router = express.Router()

router.get('/', verifyToken, getDecisions)
router.post('/', verifyToken, createDecision)

export default router