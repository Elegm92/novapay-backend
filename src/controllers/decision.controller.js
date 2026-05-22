import { AnalystDecision } from "../models/index.js";
import { sendFeedback } from "../services/fraud.service.js";

const createDecision = async (req, res) => {
  try {
    const { transaction_id, verdict, notes } = req.body

    if (!transaction_id || !verdict) {
      return res.status(400).json({ message: 'transaction_id and verdict are required' })
    }

    if (!['fraud', 'legitimate'].includes(verdict)) {
      return res.status(400).json({ message: 'Verdict must be fraud or legitimate' })
    }

    const decision = await AnalystDecision.create({
      transaction_id,
      verdict,
      notes: notes || null,
      analyst_id: req.user.id,
    });

    await sendFeedback({
      transaction_id,
      analyst_decision: verdict,
      analyst_notes: notes || null,
      analyst_id: req.user.id,
    });

    res.status(201).json(decision)

  } catch (error) {
    console.error('createDecision error:', error.message)
    res.status(500).json({ message: 'Failed to create decision' })
  }
}

const getDecisions = async (req, res) => {
  try {
    const decisions = await AnalystDecision.findAll();
    res.json(decisions);
  } catch (error) {
    console.error("getDecisions error:", error.message);
    res.status(500).json({ message: "Failed to get decisions" });
  }
}

export { createDecision, getDecisions }