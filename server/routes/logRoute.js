const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminCheck = require("../middlewares/adminCheck");
const { getAllLogs,deleteAllLogs } = require("../controllers/logCtrl");

router.get("/logs", authMiddleware, adminCheck, getAllLogs);
router.delete("/logs", authMiddleware, adminCheck, deleteAllLogs);

module.exports = router;
