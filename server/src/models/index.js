const { Sequelize } = require("sequelize");
const sequelize = require("../config/database");

const Task = require("./tasks")(sequelize, Sequelize.DataTypes);

const db = {};
db.sequelize = sequelize;
db.Task = Task; // Attach Task model

module.exports = { sequelize, Task };
