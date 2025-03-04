const jwtGenerator = require("../utils/jwtGenerator");
const pool = require("../config/db");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
    console.log("🟢 Register request received:", req.body);

    const { name, email, password } = req.body;

    try {
        console.log("🔍 Checking if user already exists in the database...");
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

        if (user.rows.length > 0) {
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
        const newUser = await pool.query(
            "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, bcryptPassword]
        );
        console.log("✅ New user inserted:", newUser.rows[0]);

        console.log("🔑 Generating JWT token...");
        const token = jwtGenerator(newUser.rows[0].user_id);
        console.log("✅ JWT token generated");

        res.status(200).json({ success: true, message: "Registration successful", token });

    } catch (error) {
        console.error("❌ Server Register Error:", error);
        res.status(500).json({ success: false, message: `Server Register Error: ${error.message}` });
    }
};

module.exports = { registerUser };
