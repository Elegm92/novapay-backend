const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    round1: {
      total_transactions: 150,
      fraud_detected: 87,
      fraud_evaded: 63,
      detection_rate: "58%",
      amount_blocked: 45000,
    },
    round2: {
      total_transactions: 150,
      fraud_detected: 123,
      fraud_evaded: 27,
      detection_rate: "82%",
      amount_blocked: 78000,
    },
    pending_cases: 2,
    resolved_cases: 0,
  });
});

module.exports = router;
