const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware for User Authentication
exports.userAuth = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid or Expired Token" });
    }
};

// Middleware for Admin Authentication
exports.adminAuth1 = (req, res, next) => {
    const token = req.header("Authorization"); 
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified.isAdmin) return res.status(403).json({ message: "Admin Access Required" });
        req.admin = verified;
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid or Expired Token" });
    }
};
