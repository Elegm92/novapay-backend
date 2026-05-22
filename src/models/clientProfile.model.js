import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const ClientProfile = sequelize.define(
  "ClientProfile",
  {
    client_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    total_transactions: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_amount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    fraud_flags: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    last_seen: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    risk_profile: {
      type: DataTypes.ENUM("low", "medium", "high"),
      defaultValue: "low",
    },
  },
  {
    timestamps: true,
  },
);

export default ClientProfile;
