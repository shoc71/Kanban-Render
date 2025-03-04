const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming your Sequelize instance is in this file
const User = require('./user'); // Assuming you have the User model defined

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        references: {
            model: User,  // 'User' model
            key: 'user_id'  // Reference to the 'user_id' column in the 'users' table
        },
        onDelete: 'CASCADE',  // When the associated user is deleted, tasks are also deleted
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        onUpdate: Sequelize.NOW
    }
}, {
    tableName: 'tasks',  // Specify the table name
    timestamps: false,  // If you're using `created_at` and `updated_at`, set this to `false`
});

Task.belongsTo(User, {
    foreignKey: 'user_id',
    targetKey: 'user_id',
    onDelete: 'CASCADE'
});

module.exports = Task;
