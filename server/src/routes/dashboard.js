const router = require("express").Router();
const pool = require("../config/db");
const authorizeUser = require("../middleware/authorizingUser");

router.get('/', authorizeUser, async (req, res) => {
    try {
        // res.json(req.user);

        const user = await pool.query("SELECT * FROM users WHERE user_id = $1",
            [req.user.id]
        );

        res.status(200).json({ success: true, data: user.rows[0] })

    } catch (error) {
        console.error("")
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;