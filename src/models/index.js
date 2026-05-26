import Analyst from "./analyst.model.js";
import AnalystDecision from "./analystDecision.model.js";
import Transaction from "./transaction.model.js";
import ClientProfile from "./clientProfile.model.js";

// Analyst → AnalystDecision
Analyst.hasMany(AnalystDecision, { foreignKey: "analyst_id" });
AnalystDecision.belongsTo(Analyst, { foreignKey: "analyst_id" });

// AnalystDecision → Transaction (para el historial)
AnalystDecision.belongsTo(Transaction, {
  foreignKey: "transaction_id",
  targetKey: "transaction_id",
  as: "Transaction",
});

// ClientProfile → Transaction (comentado — DS provee el perfil del cliente)
// ClientProfile.hasMany(Transaction, {
//   foreignKey: "nameOrig",
//   sourceKey: "client_id",
//   as: "Transactions",
// });
// Transaction.belongsTo(ClientProfile, {
//   foreignKey: "nameOrig",
//   targetKey: "client_id",
//   as: "ClientProfile",
// });

export { Analyst, AnalystDecision, Transaction, ClientProfile };