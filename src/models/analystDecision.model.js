import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import Analyst from "./analyst.model.js";

const AnalystDecision = sequelize.define(
  "AnalystDecision",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verdict: {
      type: DataTypes.ENUM("fraud", "legitimate"),
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    analyst_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Analyst,
        key: "id",
      },
    },
  }
);

export default AnalystDecision;
