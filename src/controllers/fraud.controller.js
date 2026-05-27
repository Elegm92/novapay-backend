import {
  decideTransaction,
  getChallengeRecommendation,
  sendFeedback,
  previewThreshold,
} from "../services/fraud.service.js";

const decide = async (req, res) => {
  try {
    const transaction = req.body;

    if (!transaction.amount || !transaction.nameOrig || !transaction.step) {
      return res.json({
        decision: transaction.decision || "review",
        fraud_probability: transaction.fraud_probability ?? 0,
        risk_level: transaction.risk_level || "medium",
        timestamp: new Date().toISOString(),
        source: "cached",
      });
    }

    // Limpiar nulls antes de mandar a DS
    const cleanTransaction = {
      transaction_id: transaction.transaction_id,
      step: transaction.step ?? 1,
      type: transaction.type || "TRANSFER",
      amount: transaction.amount ?? 0,
      nameOrig: transaction.nameOrig || "unknown",
      oldbalanceOrg: transaction.oldbalanceOrg ?? 0,
      newbalanceOrig: transaction.newbalanceOrig ?? 0,
      nameDest: transaction.nameDest || "unknown",
      oldbalanceDest: transaction.oldbalanceDest ?? 0,
      newbalanceDest: transaction.newbalanceDest ?? 0,
      merchant_category: transaction.merchant_category || "unknown",
      ip_country: transaction.ip_country || "unknown",
    };

    const data = await decideTransaction(cleanTransaction);
    res.json(data);
  } catch (error) {
    console.error("decide error:", error.message);
    const transaction = req.body;
    return res.json({
      decision: transaction.decision || "review",
      fraud_probability: transaction.fraud_probability ?? 0,
      risk_level: transaction.risk_level || "medium",
      timestamp: new Date().toISOString(),
      source: "cached",
    });
  }
};

const challenge = async (req, res) => {
  try {
    const transaction = req.body;

    if (!transaction.fraud_probability && !transaction.risk_level) {
      return res.json({
        recommended_action: "MANUAL_REVIEW",
        reasoning:
          "Datos insuficientes para generar una recomendación automática. Revisión manual requerida.",
        primary_option: {
          friction: "medium",
          user_message:
            "Hemos pausado esta operación. Nuestro equipo la revisará en breve.",
        },
        alternative_options: [],
      });
    }

    const data = await getChallengeRecommendation(transaction);
    res.json(data);
  } catch (error) {
    console.error("challenge error:", error.message);
    return res.json({
      recommended_action: "MANUAL_REVIEW",
      reasoning:
        "Servicio de análisis no disponible temporalmente. Revisión manual requerida.",
      primary_option: {
        friction: "medium",
        user_message:
          "Hemos pausado esta operación. Nuestro equipo la revisará en breve.",
      },
      alternative_options: [],
    });
  }
};

const feedback = async (req, res) => {
  try {
    const data = await sendFeedback(req.body);
    res.json(data);
  } catch (error) {
    console.error("feedback error:", error.message);
    res.status(500).json({ message: "Failed to send feedback" });
  }
};

const preview = async (req, res) => {
  try {
    const data = await previewThreshold(req.body);
    res.json(data);
  } catch (error) {
    console.error("preview error:", error.message);
    res.json({
      blocked: 0,
      reviewed: 0,
      allowed: 0,
      fraud_caught: 0,
      false_positives: 0,
      money_saved: 0,
      recommendation: "Servicio de preview no disponible temporalmente.",
      comparison: null,
    });
  }
};

export { decide, challenge, feedback, preview };
