import {
  decideTransaction,
  getChallengeRecommendation,
  sendFeedback,
  previewThreshold,
} from "../services/fraud.service.js";

const decide = async (req, res) => {
  try {
    const transaction = req.body;

    // Si faltan campos críticos, devolver los datos que ya tenemos en Supabase
    if (!transaction.amount || !transaction.nameOrig || !transaction.step) {
      return res.json({
        decision: transaction.decision || "review",
        fraud_probability: transaction.fraud_probability ?? 0,
        risk_level: transaction.risk_level || "medium",
        timestamp: new Date().toISOString(),
        source: "cached",
      });
    }

    const data = await decideTransaction(transaction);
    res.json(data);
  } catch (error) {
    console.error("decide error:", error.message);
    res.status(500).json({ message: "Failed to get ML decision" });
  }
};

const challenge = async (req, res) => {
  try {
    const transaction = req.body;

    // Si faltan campos críticos, devolver una recomendación genérica
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
    res.status(500).json({ message: "Failed to get challenge recommendation" });
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
    res.status(500).json({ message: "Failed to preview threshold" });
  }
};

export { decide, challenge, feedback, preview };
