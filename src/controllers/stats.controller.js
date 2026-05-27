import { Transaction, AnalystDecision } from "../models/index.js";
import { getStats } from "../services/fraud.service.js";
import { Op } from "sequelize";

const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalTransactions = await Transaction.count();

    const transactionsToday = await Transaction.count({
      where: { timestamp: { [Op.gte]: today } },
    });

    const pendingCases = await Transaction.count({
      where: { status: "pending" },
    });

    const blockedTransactions = await Transaction.count({
      where: { decision: "block" },
    });

    const detectionRate =
      totalTransactions > 0
        ? ((blockedTransactions / totalTransactions) * 100).toFixed(1)
        : 0;

    res.json({
      total_transactions: totalTransactions,
      transactions_today: transactionsToday,
      pending_cases: pendingCases,
      blocked_transactions: blockedTransactions,
      detection_rate: `${detectionRate}%`,
    });
  } catch (error) {
    console.error("getDashboardStats error:", error.message);
    res.status(500).json({ message: "Failed to get stats" });
  }
};

const getDSStats = async (req, res) => {
  try {
    const data = await getStats();
    res.json(data);
  } catch (dsError) {
    console.error("getDSStats error — fallback a Supabase:", dsError.message);

    try {
      const totalTransactions = await Transaction.count();

      const fraudTransactions = await Transaction.count({
        where: { risk_level: "high" },
      });

      const blockedTransactions = await Transaction.count({
        where: { decision: "block" },
      });

      const pendingCases = await Transaction.count({
        where: { status: "pending" },
      });

      const detectionRate =
        totalTransactions > 0
          ? ((fraudTransactions / totalTransactions) * 100).toFixed(1)
          : 0;

      res.json({
        total_transactions: totalTransactions,
        fraud_detected: fraudTransactions,
        blocked: blockedTransactions,
        pending: pendingCases,
        detection_rate: `${detectionRate}%`,
        source: "cached",
      });
    } catch (fallbackError) {
      console.error("getDSStats fallback error:", fallbackError.message);
      res.status(500).json({ message: "Failed to get DS stats" });
    }
  }
};

const getHistoryStats = async (req, res) => {
  try {
    const totalApproved = await AnalystDecision.count({
      where: { verdict: "legitimate" },
    });

    const totalBlocked = await AnalystDecision.count({
      where: { verdict: "fraud" },
    });

    const manualFlags = await AnalystDecision.count();

    res.json({
      total_approved: totalApproved,
      total_blocked: totalBlocked,
      manual_flags: manualFlags,
    });
  } catch (error) {
    console.error("getHistoryStats error:", error.message);
    res.status(500).json({ message: "Failed to get history stats" });
  }
};

export { getDashboardStats, getDSStats, getHistoryStats };
