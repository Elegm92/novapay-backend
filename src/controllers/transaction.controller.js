import { getFraudQueue } from "../services/fraud.service.js";
import Transaction from "../models/transaction.model.js";
import { Op } from "sequelize";

const getQueue = async (req, res) => {
  try {
    const { limit, offset, type, risk_level } = req.query;

    let dsData = null;
    try {
      dsData = await getFraudQueue({ limit, offset, type, risk_level });
    } catch (dsError) {
      console.error("DS queue error — fallback a Supabase:", dsError.message);
    }

    if (dsData?.queue && dsData.queue.length > 0) {
      const enrichedQueue = await Promise.all(
        dsData.queue.map(async (tx) => {
          try {
            let dbTx = await Transaction.findOne({
              where: { transaction_id: tx.transaction_id },
            });

            if (dbTx) {
              const updates = {};
              if (tx.amount != null) updates.amount = tx.amount;
              if (tx.type) updates.type = tx.type;
              if (tx.ip_country) updates.ip_country = tx.ip_country;
              if (tx.merchant_category)
                updates.merchant_category = tx.merchant_category;
              if (tx.fraud_probability != null)
                updates.fraud_probability = tx.fraud_probability;
              if (tx.risk_level) updates.risk_level = tx.risk_level;
              if (tx.decision) updates.decision = tx.decision;
              if (tx.nameOrig) updates.nameOrig = tx.nameOrig;
              if (tx.nameDest) updates.nameDest = tx.nameDest;
              if (tx.step != null) updates.step = tx.step;

              if (Object.keys(updates).length > 0) {
                await dbTx.update(updates);
                await dbTx.reload();
              }
            } else {
              dbTx = await Transaction.create({
                transaction_id: tx.transaction_id,
                step: tx.step || null,
                amount: tx.amount || null,
                type: tx.type || null,
                nameOrig: tx.nameOrig || null,
                nameDest: tx.nameDest || null,
                oldbalanceOrg: tx.oldbalanceOrg || null,
                newbalanceOrig: tx.newbalanceOrig || null,
                oldbalanceDest: tx.oldbalanceDest || null,
                newbalanceDest: tx.newbalanceDest || null,
                ip_country: tx.ip_country || "unknown",
                merchant_category: tx.merchant_category || "unknown",
                fraud_probability: tx.fraud_probability || null,
                risk_level: tx.risk_level || null,
                decision: tx.decision || null,
                status: "pending",
                timestamp: tx.timestamp || new Date(),
              });
            }

            return dbTx.toJSON();
          } catch (txError) {
            console.error(
              `Error processing tx ${tx.transaction_id}:`,
              txError.message,
            );
            return tx;
          }
        }),
      );

      const filteredQueue = enrichedQueue.filter((tx) => {
        if (type && tx.type?.toUpperCase() !== type.toUpperCase()) return false;
        if (risk_level && tx.risk_level !== risk_level) return false;
        return true;
      });

      return res.json({ ...dsData, queue: filteredQueue });
    }

    const where = { status: "pending" };
    if (type) where.type = { [Op.in]: type.split(",") };
    if (risk_level) where.risk_level = risk_level;

    const localTransactions = await Transaction.findAll({
      where,
      order: [["timestamp", "DESC"]],
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0,
    });

    const total = await Transaction.count({ where });

    res.json({
      total_pending: total,
      queue: localTransactions.map((tx) => tx.toJSON()),
    });
  } catch (error) {
    console.error("getQueue error:", error.message);
    res.status(500).json({ message: "Failed to get fraud queue" });
  }
};

export { getQueue };
