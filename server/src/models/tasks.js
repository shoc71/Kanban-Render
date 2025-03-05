const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "To-Do",
    },
    user_id: {
      type: DataTypes.STRING, // Change from UUID to STRING
      references: {
        model: "users",
        key: "user_id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "tasks",
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

module.exports = Task;
