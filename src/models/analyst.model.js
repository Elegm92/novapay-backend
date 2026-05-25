import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Analyst = sequelize.define("Analyst", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("analyst", "admin"),
    defaultValue: "analyst",
  },
  avatar_style: {
    type: DataTypes.STRING,
    defaultValue: "bottts",
  },
});

export default Analyst;
