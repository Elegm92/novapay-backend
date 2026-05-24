import {
  decideTransaction,
  getChallengeRecommendation,
  sendFeedback,
  previewThreshold,
} from "../services/fraud.service.js";

const decide = async (req, res) => {
  try {
    const data = await decideTransaction(req.body);
    res.json(data);
  } catch (error) {
    console.error("decide error:", error.message);
    res.status(500).json({ message: "Failed to get ML decision" });
  }
};

const challenge = async (req, res) => {
  try {
    const data = await getChallengeRecommendation(req.body);
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