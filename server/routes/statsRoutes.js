const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminCheck = require("../middlewares/adminCheck");
const { productInfo, getCompletedDailyTasksWithEmployeeDetails } = require("../controllers/statsCtrl");

router.get('/', authMiddleware,adminCheck, productInfo);
router.get('/completed-tasks',getCompletedDailyTasksWithEmployeeDetails);

module.exports = router;