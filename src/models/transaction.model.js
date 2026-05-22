import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Transaction = sequelize.define(
  "Transaction",
  {
    transaction_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        "TRANSFER",
        "CASH_OUT",
        "PAYMENT",
        "DEBIT",
        "CASH_IN",
      ),
      allowNull: false,
    },
    nameOrig: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nameDest: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    oldbalanceOrg: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    newbalanceOrig: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    oldbalanceDest: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    newbalanceDest: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    ip_country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    merchant_category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fraud_probability: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    risk_level: {
      type: DataTypes.ENUM("low", "medium", "high"),
      allowNull: true,
    },
    decision: {
      type: DataTypes.ENUM("allow", "review", "block"),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "reviewed"),
      defaultValue: "pending",
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

export default Transaction;
