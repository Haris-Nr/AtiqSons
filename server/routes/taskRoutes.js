const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminCheck = require("../middlewares/adminCheck");
const { createTask, deleteTask, fetchTasksForEmployee, changeTaskStatus, fetchTasksAllemployee, dailyTasksForEmployee } = require('../controllers/taskCtrl');

router.post("/addtask",authMiddleware,adminCheck, createTask);
router.delete("/deletetask/:id",authMiddleware,adminCheck, deleteTask);
router.get("/fetchTaskForEmployee",authMiddleware, fetchTasksForEmployee);
router.patch("/changestatus/:id", authMiddleware, changeTaskStatus);
router.get("/fetchTaskAllEmployee",authMiddleware,adminCheck,fetchTasksAllemployee);
router.get("/dailytask",authMiddleware,dailyTasksForEmployee);


module.exports = router;
