import {
  getFraudQueue,
} from "../services/fraud.service.js";
import Transaction from "../models/transaction.model.js";

const getQueue = async (req, res) => {
  try {
    const { limit, risk_level } = req.query;
    const data = await getFraudQueue({ limit, risk_level });

    // Persistir cada transacción en Supabase
    if (data?.queue && Array.isArray(data.queue)) {
      await Promise.all(
        data.queue.map(async (tx) => {
          await Transaction.findOrCreate({
            where: { transaction_id: tx.transaction_id },
            defaults: {
              step: tx.step,
              amount: tx.amount,
              type: tx.type,
              nameOrig: tx.nameOrig,
              nameDest: tx.nameDest,
              oldbalanceOrg: tx.oldbalanceOrg,
              newbalanceOrig: tx.newbalanceOrig,
              oldbalanceDest: tx.oldbalanceDest,
              newbalanceDest: tx.newbalanceDest,
              ip_country: tx.ip_country || "unknown",
              merchant_category: tx.merchant_category || "unknown",
              fraud_probability: tx.fraud_probability,
              risk_level: tx.risk_level,
              decision: tx.decision,
              status: "pending",
              timestamp: tx.timestamp,
            },
          });
        }),
      );
    }

    res.json(data);
  } catch (error) {
    console.error("getQueue error:", error.message);
    res.status(500).json({ message: "Failed to get fraud queue" });
  }
};

// const getTransactionById = async (req, res) => {
//   try {
//     const data = await getTransactionDetail(req.params.id);
//     if (!data)
//       return res.status(404).json({ message: "Transaction not found" });
//     res.json(data);
//   } catch (error) {
//     console.error("getTransactionById error:", error.message);
//     res.status(500).json({ message: "Failed to get transaction" });
//   }
// };

export { getQueue };
