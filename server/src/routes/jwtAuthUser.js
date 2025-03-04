const router = require("express").Router();
// const pool = require("../config/db")
// const bcrypt = require("bcrypt")
// const jwtGenerator = require("../utils/jwtGenerator")
const loginUser = require("../controllers/loginUser");
const { registerUser } = require("../controllers/registerUser");
const { validUser } = require("../middleware/validateUser");
const authorizeUser = require("../middleware/authorizingUser");

// register
router.post("/register", validUser, registerUser)
router.post("/login", validUser, loginUser)

router.get("/is-verify", authorizeUser, async (req, res) => {
    try {
        res.json(true)
    } catch (error) {
        console.error(`Server Validation Error: `, error)
        res.status(500).json({ success: false, message: `Server Validation Error: ${error.message}` });
    }
});

module.exports = router;