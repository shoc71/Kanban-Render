const jwt = require("jsonwebtoken");
require("dotenv").config();

function authorizeUser(req, res, next) {
    // Get the token from the Authorization header, which should be in the format "Bearer <token>"
    const jwtToken = req.header("Authorization")?.split(" ")[1];

    // console.log(jwtToken)

    // If no token is found, respond with an unauthorized status
    if (!jwtToken) {
        return res.status(403).json({ success: false, message: `Unauthorized JWT token! => ${jwtToken}` });
    }

    try {
        // Verify the token using the JWT_SECRET
        const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);

        // Attach the user to the request object for future use
        req.user = payload.user;

        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Authorization Error:", error);
        return res.status(401).json({ success: false, message: "Unauthorized Access!" });
    }
}

module.exports = authorizeUser;
