import Analyst from "./analyst.model.js";
import AnalystDecision from "./analystDecision.model.js";
import Transaction from "./transaction.model.js";
import ClientProfile from "./clientProfile.model.js";

// Analyst → AnalystDecision
Analyst.hasMany(AnalystDecision, { foreignKey: "analyst_id" });
AnalystDecision.belongsTo(Analyst, { foreignKey: "analyst_id" });

// Analyst → Transaction
Analyst.hasMany(Transaction, { foreignKey: "analyst_id" });
Transaction.belongsTo(Analyst, { foreignKey: "analyst_id" });

// ClientProfile → Transaction
ClientProfile.hasMany(Transaction, {
  foreignKey: "nameOrig",
  sourceKey: "client_id",
});
Transaction.belongsTo(ClientProfile, {
  foreignKey: "nameOrig",
  targetKey: "client_id",
});

export { Analyst, AnalystDecision, Transaction, ClientProfile };
