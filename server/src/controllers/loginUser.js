const jwtGenerator = require("../utils/jwtGenerator")
const pool = require("../config/db")
const bcrypt = require("bcrypt")

const loginUser = async (req, res) => {

    const { emailOrUsername, password } = req.body;

    try {
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1 OR user_name = $2",
            [emailOrUsername, emailOrUsername]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({ success: false, message: "User with this email or name already exists." });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);

        if (!validPassword) {
            return res.status(401).json({ success: false, message: "Email/username or Password is Incorrect!" });
        }

        const jwtToken = jwtGenerator(user.rows[0].user_id)
        console.log("Generated User ID:", user.rows[0].user_id);

        res.status(201).json({ success: true, data: jwtToken });

    } catch (error) {
        console.error("Server Login error: ", error)
        res.status(500).json({ success: false, message: `Server Login Error: ${error.message}` });
    }
};

module.exports = loginUser;