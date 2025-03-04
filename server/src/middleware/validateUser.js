function validUser(req, res, next) {
    const { emailOrUsername, password } = req.body;

    function validEmail(userEmail) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }

    if (req.originalUrl.includes("/register")) {
        const { email, name, password } = req.body;
        if (![email, name, password].every(Boolean)) {
            console.log("Registration validation failed:", { email, name, password});
            return res.status(403).json({ success: false, message: "Registration validation failed: Missing Credentials" });
        } else if (!validEmail(email)) {
            return res.status(401).json({ success: false, message: "Registration validation failed: Invalid Email" });
        }
    }

    else if (req.originalUrl.includes("/login")) {
        if (![emailOrUsername, password].every(Boolean)
        ) {
            console.log("Login validation failed:", { emailOrUsername });
            return res.status(403).json({ success: false, message: "Login validation failed: Missing Credentials" });
        } else if (emailOrUsername.includes("@") && !validEmail(emailOrUsername)) {
            return res.status(401).json({ success: false, message: "Login validation failed: Invalid Email" });
        }
    }

    next();
};

module.exports = { validUser };