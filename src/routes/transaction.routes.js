const express = require("express");
const router = express.Router();

const mockTransactions = [
  {
    id: "txn_001",
    amount: 1500.0,
    currency: "EUR",
    timestamp: "2026-05-20T10:30:00",
    sender_id: "user_123",
    receiver_id: "user_456",
    transaction_type: "transfer",
    fraud_score: 0.92,
    status: "pending",
    round: 1,
    attack_type: "identity_spoofing",
  },
  {
    id: "txn_002",
    amount: 300.0,
    currency: "EUR",
    timestamp: "2026-05-20T11:00:00",
    sender_id: "user_789",
    receiver_id: "user_101",
    transaction_type: "payment",
    fraud_score: 0.75,
    status: "pending",
    round: 1,
    attack_type: "account_takeover",
  },
];

// Listar todas
router.get("/", (req, res) => {
  res.json(mockTransactions);
});

// Detalle de una
router.get("/:id", (req, res) => {
  const transaction = mockTransactions.find((t) => t.id === req.params.id);
  if (!transaction)
    return res.status(404).json({ message: "Transaction not found" });
  res.json(transaction);
});

// Filtrar por ronda
router.get("/round/:round", (req, res) => {
  const filtered = mockTransactions.filter(
    (t) => t.round === parseInt(req.params.round),
  );
  res.json(filtered);
});

module.exports = router;
