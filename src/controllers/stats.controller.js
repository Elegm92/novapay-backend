import { Transaction } from "../models/index.js";
import { getStats } from "../services/fraud.service.js";
import { Op } from "sequelize";

const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalTransactions = await Transaction.count();

    const transactionsToday = await Transaction.count({
      where: {
        timestamp: { [Op.gte]: today }
      }
    });

    const pendingCases = await Transaction.count({
      where: { status: 'pending', decision: 'review' }
    });

    const blockedTransactions = await Transaction.count({
      where: { decision: 'block' }
    });

    const fraudCaught = await Transaction.count({
      where: { decision: 'block' }
    });

    const detectionRate = totalTransactions > 0
      ? ((fraudCaught / totalTransactions) * 100).toFixed(1)
      : 0

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
  } catch (error) {
    console.error("getDSStats error:", error.message);
    res.status(500).json({ message: "Failed to get DS stats" });
  }
};

export { getDashboardStats, getDSStats };