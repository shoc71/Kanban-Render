const { Sequelize } = require("sequelize");
const sequelize = require("../config/db");

const Task = require("./tasks"); // Import Task model

const db = {};
db.sequelize = sequelize;
db.Task = Task; // Attach Task model

module.exports = db;
