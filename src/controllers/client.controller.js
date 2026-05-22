import { ClientProfile, Transaction } from "../models/index.js";

const getClientProfile = async (req, res) => {
  try {
    const { nameOrig } = req.params;

    const client = await ClientProfile.findOne({
      where: { client_id: nameOrig },
      include: [
        {
          model: Transaction,
          as: "Transactions",
          order: [["timestamp", "DESC"]],
          limit: 10,
        },
      ],
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(client);
  } catch (error) {
    console.error("getClientProfile error:", error.message);
    res.status(500).json({ message: "Failed to get client profile" });
  }
};

export { getClientProfile };
