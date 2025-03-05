const jwtGenerator = require("../utils/jwtGenerator");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { Sequelize } = require('sequelize');

const loginUser = async (req, res) => {
    try {
        // console.log("Login request received:", req.body);

        const { emailOrUsername, password } = req.body;

        // Use Sequelize to find the user by email or username
        const user = await User.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { user_email: emailOrUsername },
                    { user_name: emailOrUsername }
                ]
            }
        });

        // console.log("User found:", user);

        // If no user found, return an error
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "User with this email or username does not exist." 
            });
        }

        // Compare the provided password with the hashed password in the database
        const validPassword = await bcrypt.compare(password, user.user_password);

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Incorrect email/username or password."
            });
        }

        // Generate JWT token with the user's unique ID
        const jwtToken = jwtGenerator(user.user_id);

        // Return the JWT token and user ID
        res.status(200).json({ 
            success: true, 
            data: {
                token: jwtToken, // Pass the generated token
                user_id: user.user_id, // Also pass the user ID
                username: user.user_name
            } 
        });

    } catch (error) {
        console.error("Server Login error:", error);
        res.status(500).json({ 
            success: false, 
            message: `Server Login Error: ${error.message}` 
        });
    }
};

module.exports = loginUser;
