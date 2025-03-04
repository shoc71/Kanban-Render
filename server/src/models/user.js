// models/User.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ensure this is connected to your PostgreSQL

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
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
}, {
    tableName: 'users',
    timestamps: false, // Optional, depending on your table structure
});

module.exports = User;
