const jwt = require('jsonwebtoken');
const User = require("../models/User");
require("dotenv").config();

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Get token from Authorization header
    if (!token) {
        return res.sendStatus(403); // Forbidden
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user; // Save user info to request
        next();
    });
};

// Endpoint to retrieve user data
module.exports = authenticateJWT
