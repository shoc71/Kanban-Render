const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { v4: uuidv4 } = require("uuid"); // Import UUID generator

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.STRING, // Use STRING instead of UUID
      primaryKey: true,
      allowNull: false,
      unique: true,
      defaultValue: () => uuidv4(), // Generate UUID before insertion
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    user_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: false, // Optional
  }
);

module.exports = User;
