import { Transaction, AnalystDecision } from "../models/index.js";
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

    const detectionRate = totalTransactions > 0
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
  } catch (error) {
    console.error("getDSStats error:", error.message);
    res.status(500).json({ message: "Failed to get DS stats" });
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

    // Avg resolve time: minutos entre transaction.timestamp y decision.createdAt
    const decisions = await AnalystDecision.findAll({
      include: [
        {
          model: Transaction,
          as: "Transaction",
          attributes: ["timestamp"],
          required: true,
        },
      ],
      attributes: ["createdAt"],
    });

    let avgResolveTime = null;
    if (decisions.length) {
      const totalMinutes = decisions.reduce((acc, d) => {
        const diff = new Date(d.createdAt) - new Date(d.Transaction.timestamp);
        return acc + diff / 1000 / 60;
      }, 0);
      avgResolveTime = Math.round(totalMinutes / decisions.length);
    }

    res.json({
      total_approved: totalApproved,
      total_blocked: totalBlocked,
      manual_flags: manualFlags,
      avg_resolve_time_minutes: avgResolveTime,
    });
  } catch (error) {
    console.error("getHistoryStats error:", error.message);
    res.status(500).json({ message: "Failed to get history stats" });
  }
};

export { getDashboardStats, getDSStats, getHistoryStats };