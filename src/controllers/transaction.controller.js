import {getFraudQueue,getTransactionDetail} from "../services/fraud.service.js";

const getQueue = async (req, res) => {
  try {
    const { limit, risk_level } = req.query;
    const data = await getFraudQueue({ limit, risk_level });
    res.json(data);
  } catch (error) {
    console.error("getQueue error:", error.message);
    res.status(500).json({ message: "Failed to get fraud queue" });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const data = await getTransactionDetail(req.params.id);
    if (!data)
      return res.status(404).json({ message: "Transaction not found" });
    res.json(data);
  } catch (error) {
    console.error("getTransactionById error:", error.message);
    res.status(500).json({ message: "Failed to get transaction" });
  }
};

export { getQueue, getTransactionById };
