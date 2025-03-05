const jwtGenerator = require("../utils/jwtGenerator");
const bcrypt = require("bcrypt");
const User = require("../models/user")
const { Sequelize } = require('sequelize');

const loginUser = async (req, res) => {
    try {
        console.log("Login request received:", req.body);

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

        console.log("User found:", user);

        if (!user) {
            return res.status(401).json({ success: false, message: "User with this email or name does not exist." });
        }

        // Compare the provided password with the hashed password from the database
        const validPassword = await bcrypt.compare(password, user.user_password);

        if (!validPassword) {
            return res.status(401).json({ success: false, message: "Email/username or Password is Incorrect!" });
        }

        // Generate JWT token
        const jwtToken = jwtGenerator(user.user_id);
        console.log("Generated User ID:", user.user_id);

        res.status(200).json({ success: true, data: jwtToken });

    } catch (error) {
        console.error("Server Login error: ", error);
        res.status(500).json({ success: false, message: `Server Login Error: ${error.message}` });
    }
};

module.exports = loginUser;
