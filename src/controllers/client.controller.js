import { getClientProfileDS } from "../services/fraud.service.js";

const getClientProfile = async (req, res) => {
  try {
    const { nameOrig } = req.params;
    const { limit = 20, offset = 0 } = req.query;
    const data = await getClientProfileDS(nameOrig, limit, offset);

    if (!data) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(data);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ message: "Client not found" });
    }
    console.error("getClientProfile error:", error.message);
    res.status(500).json({ message: "Failed to get client profile" });
  }
};

export { getClientProfile };
