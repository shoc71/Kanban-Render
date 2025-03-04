const jwtGenerator = require("../utils/jwtGenerator")
const pool = require("../config/db")
const bcrypt = require("bcrypt")

const registerUser = async (req, res) => {

    const { name, email, password } = req.body;

    try {
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1",
            [email]
        );

        if (user.rows.length > 0) {
            return res.status(409).json({ success: false, message: "Email already registered. Please log in." });
        }

        const salt = await bcrypt.genSalt(10)
        const bcryptPassword = await bcrypt.hash(password, salt)

        const newUser = await pool.query("INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, bcryptPassword]
        );

        const token = jwtGenerator(newUser.rows[0].user_id);
        res.status(200).json({ success: true, message: "Registration successful", token });

    } catch (error) {
        console.error("Server Register Error: ", error)
        res.status(500).json({ success: false, message: `Server Regsiter Error: ${error.message}` });
    }
};

module.exports = { registerUser };