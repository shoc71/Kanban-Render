const jwt = require("jsonwebtoken");
require("dotenv").config();

function authorizeUser(req, res, next) {
    const jwtToken = req.header("token");

    if (!jwtToken) {
        return res.status(403).json({ success: false, message: "Unauthorized JWT token!" })
    }

    try {
               
        const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);

        req.user = payload.user;

        next();

    } catch (error) {
        console.error(`Authorization Error: `, error)
        return res.status(401).json({ success: false, message: "Unauthorized Access!" });
    }
};

module.exports = authorizeUser;