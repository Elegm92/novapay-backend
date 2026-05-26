import { getClientProfileDS } from "../services/fraud.service.js";
import Transaction from "../models/transaction.model.js";

const getClientProfile = async (req, res) => {
  try {
    const { nameOrig } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    try {
      const data = await getClientProfileDS(nameOrig, limit, offset);
      if (data) return res.json(data);
    } catch (dsError) {
      console.error("DS client error — fallback a Supabase:", dsError.message);
    }

    // Fallback — buscar en Supabase
    const transactions = await Transaction.findAll({
      where: { nameOrig },
      order: [["timestamp", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    if (!transactions.length) {
      return res.status(404).json({ message: "Client not found" });
    }

    const total_volume = transactions.reduce(
      (acc, tx) => acc + (tx.amount || 0),
      0,
    );
    const avg_amount = total_volume / transactions.length;
    const fraud_count = transactions.filter(
      (tx) => tx.risk_level === "high",
    ).length;
    const fraud_rate =
      transactions.length > 0 ? fraud_count / transactions.length : 0;

    res.json({
      client_id: nameOrig,
      stats: {
        total_transactions: transactions.length,
        total_volume: parseFloat(total_volume.toFixed(2)),
        avg_amount: parseFloat(avg_amount.toFixed(2)),
        max_amount: Math.max(...transactions.map((tx) => tx.amount || 0)),
        first_seen: transactions[transactions.length - 1]?.timestamp,
        last_seen: transactions[0]?.timestamp,
        fraud_rate_historical: parseFloat(fraud_rate.toFixed(4)),
        distinct_counterparties: new Set(
          transactions.map((tx) => tx.nameDest).filter(Boolean),
        ).size,
        most_used_type:
          transactions
            .map((tx) => tx.type)
            .filter(Boolean)
            .sort(
              (a, b) =>
                transactions.filter((tx) => tx.type === b).length -
                transactions.filter((tx) => tx.type === a).length,
            )[0] || null,
      },
      recent_transactions: transactions.map((tx) => ({
        transaction_id: tx.transaction_id,
        timestamp: tx.timestamp,
        step: tx.step,
        type: tx.type,
        amount: tx.amount,
        nameDest: tx.nameDest,
        oldbalanceOrg: tx.oldbalanceOrg,
        newbalanceOrig: tx.newbalanceOrig,
        is_flagged_fraud: tx.risk_level === "high",
      })),
      risk_flags: [
        ...(fraud_rate > 0.5 ? ["high_fraud_rate"] : []),
        ...(transactions.length === 1 ? ["new_client"] : []),
        ...(Math.max(...transactions.map((tx) => tx.amount || 0)) > 10000
          ? ["unusual_amount"]
          : []),
      ],
      source: "cached",
    });
  } catch (error) {
    console.error("getClientProfile error:", error.message);
    res.status(500).json({ message: "Failed to get client profile" });
  }
};

export { getClientProfile };
