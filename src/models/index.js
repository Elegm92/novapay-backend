import Analyst from "./analyst.model.js";
import AnalystDecision from "./analystDecision.model.js";

// Relaciones
Analyst.hasMany(AnalystDecision, { foreignKey: "analyst_id" });
AnalystDecision.belongsTo(Analyst, { foreignKey: "analyst_id" });

export { Analyst, AnalystDecision };
