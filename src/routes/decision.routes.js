const express = require("express");
const router = express.Router();

const mockDecisions = [];

// Crear decisión sobre una transacción
router.post("/:transactionId", (req, res) => {
  const { verdict, notes } = req.body;

  if (!verdict) {
    return res.status(400).json({ message: "Verdict is required" });
  }

  if (!["fraud", "legitimate"].includes(verdict)) {
    return res
      .status(400)
      .json({ message: "Verdict must be fraud or legitimate" });
  }

  const decision = {
    id: `dec_${Date.now()}`,
    transaction_id: req.params.transactionId,
    verdict,
    notes: notes || null,
    analyst_id: "user_1",
    timestamp: new Date().toISOString(),
  };

  mockDecisions.push(decision);
  res.status(201).json(decision);
});

// Ver todas las decisiones
router.get("/", (req, res) => {
  res.json(mockDecisions);
});

module.exports = router;
