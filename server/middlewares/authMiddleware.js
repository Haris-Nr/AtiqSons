const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const User = require("../models/userModel");

module.exports = async (req, res, next) => {
    try {

        if (!req.headers.authorization) {
            throw new Error("Unauthorized");
        }
        
        const tokenParts = req.headers.authorization.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            throw new Error("Unauthorized");
        }
        const token = tokenParts[1];

        const decodedToken = jwt.verify(token, secret);
        req.body.userId = decodedToken.userId;
        req.user = await User.findById(decodedToken.userId);
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};
