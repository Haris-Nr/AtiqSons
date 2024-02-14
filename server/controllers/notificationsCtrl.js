const Notification = require("../models/notificationModel");

// add a new notification   /// not using right now in frontend
const newNotification = async (req, res) => {
  try {
    const newNotification = new Notification(req.body);
    await newNotification.save();
    res.send({
      success: true,
      message: "Notification added successfully!!",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};


//Delete the notification
const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.send({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};


//Seen or read all notifications by user
const seenNotification = async (req, res) => {
  try {
    const notificationId = req.body.notificationId;

    await Notification.updateOne(
      { _id: notificationId, user: req.body.userId, seen: false },
      { $set: { seen: true } },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// delete all notifications
const deleteAllNotifications = async (req, res) => {
  try {
   const userId = req.body.userId;
    await Notification.deleteMany({user:userId});
    res.status(200).send({
      success: true,
      message: "All notifications have been deleted",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};




module.exports = {
  newNotification,
  deleteNotification,
  seenNotification,
  deleteAllNotifications,
};
