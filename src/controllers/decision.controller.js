import { AnalystDecision, Transaction, Analyst } from "../models/index.js";
import { sendFeedback } from "../services/fraud.service.js";
import { Op } from "sequelize";

const createDecision = async (req, res) => {
  try {
    const { transaction_id, verdict, notes } = req.body;

    if (!transaction_id || !verdict) {
      return res
        .status(400)
        .json({ message: "transaction_id and verdict are required" });
    }

    if (!["fraud", "legitimate"].includes(verdict)) {
      return res
        .status(400)
        .json({ message: "Verdict must be fraud or legitimate" });
    }

    const analystIdRegex = /^[a-zA-Z0-9_-]{3,64}$/;
    if (!analystIdRegex.test(req.user.id)) {
      return res.status(400).json({ message: "Invalid analyst_id format" });
    }

    const decision = await AnalystDecision.create({
      transaction_id,
      verdict,
      notes: notes || null,
      analyst_id: req.user.id,
    });

    // Marcar la transacción como revisada
    await Transaction.update(
      { status: "reviewed" },
      { where: { transaction_id } },
    );

    try {
      await sendFeedback({
        transaction_id,
        analyst_decision: verdict,
        analyst_notes: notes || null,
        analyst_id: req.user.id,
      });
    } catch (feedbackError) {
      console.error("sendFeedback error:", feedbackError.message);
    }

    res.status(201).json(decision);
  } catch (error) {
    console.error("createDecision error:", error.message);
    res.status(500).json({ message: "Failed to create decision" });
  }
};

const getDecisions = async (req, res) => {
  try {
    const { verdict, dateFrom, dateTo } = req.query;

    const where = {};
    if (verdict) where.verdict = verdict;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt[Op.gte] = new Date(dateFrom); // gte = greater than or equal = >=
      if (dateTo) where.createdAt[Op.lte] = new Date(dateTo + "T23:59:59"); // lte = less than or equal = <=
    }

    const decisions = await AnalystDecision.findAll({
      where,
      include: [
        {
          model: Transaction,
          as: "Transaction",
          required: false,
        },
        {
          model: Analyst,
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(decisions);
  } catch (error) {
    console.error("getDecisions error:", error.message);
    res.status(500).json({ message: "Failed to get decisions" });
  }
};

export { createDecision, getDecisions };
