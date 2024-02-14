module.exports = async (req, res, next) => {
    if(req.user.role === "employee" && req.user.dashboard === "china"){
        next();
    } else {
        res.status(403).json({ message: "Access denied. Only China employees are allowed." });
    }
}