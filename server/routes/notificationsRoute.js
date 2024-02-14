const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { newNotification, deleteNotification, seenNotification, deleteAllNotifications } = require("../controllers/notificationsCtrl");


router.post("/notify", authMiddleware,newNotification)
router.delete("/deleteNotification/:id", authMiddleware,deleteNotification)
router.delete("/deleteAll/", authMiddleware,deleteAllNotifications)
router.patch("/seenNotification/", authMiddleware, seenNotification)

module.exports = router;
