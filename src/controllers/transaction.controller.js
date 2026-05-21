import {
  getFraudQueue,
  getTransactionDetail,
} from "../services/fraud.service.js";

const mockQueue = [
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

const getQueue = async (req, res) => {
  try {
    const { round } = req.query; // cuando DS tenga API: const data = await getFraudQueue(round)
    const data = round
      ? mockQueue.filter((t) => t.round === parseInt(round))
      : mockQueue;
    res.json(data);
  } catch (error) {
    console.error("getQueue error:", error.message);
    res.status(500).json({ message: "Failed to get fraud queue" });
  }
};

const getTransactionById = async (req, res) => {
  try {
    // cuando DS tenga API: const data = await getTransactionDetail(req.params.id)
    const data = mockQueue.find((t) => t.id === req.params.id);
    if (!data)
      return res.status(404).json({ message: "Transaction not found" });
    res.json(data);
  } catch (error) {
    console.error("getTransactionById error:", error.message);
    res.status(500).json({ message: "Failed to get transaction" });
  }
};

export { getQueue, getTransactionById };
