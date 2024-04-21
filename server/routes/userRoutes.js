const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminCheck = require("../middlewares/adminCheck");
const {
    createUser,
    loginUser,
    getEmployee,
    resetPassword,
    deleteEmployee,
    fetchUser,
    changeStatus,
    logout,
    getEmployeeDetails,
    getAdmin,
    getEmployeeNameAndId,
} = require("../controllers/userCtrl");

router.post("/signup", createUser);
router.post("/login", loginUser);
router.patch("/resetpassword", resetPassword);
router.get("/getemployee", authMiddleware, adminCheck, getEmployee);
router.get("/getemployeedetails/:id", authMiddleware, adminCheck, getEmployeeDetails);
router.delete("/delete/:id", authMiddleware, adminCheck, deleteEmployee);
router.patch("/changestatus/:id", authMiddleware, adminCheck, changeStatus);
router.get("/currentuser", authMiddleware, fetchUser);
router.post("/logout", logout)
router.get("/getadmin", authMiddleware, getAdmin);
router.get("/getempnameid", authMiddleware,adminCheck, getEmployeeNameAndId);

module.exports = router;
