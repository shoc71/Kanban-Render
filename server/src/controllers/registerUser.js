const jwtGenerator = require("../utils/jwtGenerator");
const bcrypt = require("bcrypt");
const User = require("../models/user")
const { Sequelize } = require('sequelize');

const registerUser = async (req, res) => {
    console.log("🟢 Register request received:", req.body);

    const { name, email, password } = req.body;

    try {
        console.log("🔍 Checking if user already exists in the database...");
        
        // Using Sequelize's `findOne` method to check if the user already exists
        const user = await User.findOne({ where: { user_email: email } });

        if (user) {
            console.log("⚠️ Email already exists:", email);
            return res.status(409).json({ success: false, message: "Email already registered. Please log in." });
        }

        console.log("🔑 Generating salt for password hashing...");
        const salt = await bcrypt.genSalt(10);
        console.log("✅ Salt generated:", salt);

        console.log("🔒 Hashing password...");
        const bcryptPassword = await bcrypt.hash(password, salt);
        console.log("✅ Password hashed successfully");

        console.log("📝 Inserting new user into the database...");
        
        // Using Sequelize's `create` method to insert the new user into the database
        const newUser = await User.create({
            user_name: name,
            user_email: email,
            user_password: bcryptPassword,
        });
        console.log("✅ New user inserted:", newUser);

        console.log("🔑 Generating JWT token...");
        const token = jwtGenerator(newUser.user_id);
        console.log("✅ JWT token generated");

        res.status(200).json({ success: true, message: "Registration successful", token });

    } catch (error) {
        console.error("❌ Server Register Error:", error);
        res.status(500).json({ success: false, message: `Server Register Error: ${error.message}` });
    }
};

module.exports = { registerUser };
