const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminCheck = require("../middlewares/adminCheck");
const { createTask, deleteTask, getTask, fetchTasksForEmployee, changeTaskStatus, fetchTasksAllemployee } = require('../controllers/taskCtrl');

router.post("/addtask",authMiddleware,adminCheck, createTask);
router.delete("/deletetask/:id",authMiddleware,adminCheck, deleteTask);
router.get("/single/:id",authMiddleware, getTask);
router.get("/fetchTaskForEmployee",authMiddleware, fetchTasksForEmployee);
router.patch("/changestatus/:id", authMiddleware, changeTaskStatus);
router.get("/fetchTaskAllEmployee",authMiddleware,adminCheck,fetchTasksAllemployee);


module.exports = router;
