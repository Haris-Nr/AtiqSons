const User = require("../models/userModel");
const Notifications = require("../models/notificationModel");

/**
 * Creates notifications for a specific role or a specific user.
 * @param {string} role - The role of users to whom the notification should be sent. Ignored if userId is provided.
 * @param {ObjectId} userId - The ID of a specific user to receive the notification. Overrides role if provided.
 * @param {string} message - The message for the notification.
 * @param {string} title - The title of the notification.
 * @param {ObjectId} actionUserId - The ID of the user who triggered the action.
 */
const createNotification = async (
  io,
  role,
  userId,
  message,
  title,
  actionUser,
  image,
  onClick,
) => {
  try {
    let users = [];

    if (userId) {
      // If a specific user ID is provided, target only that user
      users = [userId];
    } else if (role) {
      // If no specific user ID is provided, target all users with the specified role
      const usersByRole = await User.find({ role: role }).select("_id");
      users = usersByRole.map((user) => user._id);
    }

    if (users.length > 0) {
      const newNotification = new Notifications({
        user: users,
        whichUser: actionUser,
        message: message,
        title: title,
        onClick: onClick,
        seen: false,
        image: image,
      });
      await newNotification.save();

      // Emit notification to specific user or role

      if (userId) {
        io.to(userId.toString()).emit('newNotification', newNotification);
      } else if (role) {
        // Emit to all users with the specified role
        const usersByRole = await User.find({ role: role }).select("_id");
        usersByRole.forEach((user) => {
          io.to(user._id.toString()).emit('newNotification', newNotification);
        });
      }
    }
  } catch (error) {
    console.error("Error creating notifications:", error);
  }
};



const createRoomNotification = async ({
  io,
  room,
  message,
  title,
  actionUser,
  image,
  onClick
}) => {
  try {

    let users = [];
    if(room ==="employees"){
      users = await User.find({ 
        role: "employee" 
      }).select("_id");
      users = users.map((user) => user._id);
    } else if(room==="china-employees"){
      users = await User.find({ 
        role: "employee",
        dashboard: "china"
      }).select("_id");
      users = users.map((user) => user._id);
    } else if(room === "dubai-employees"){
      users = await User.find({ 
        role: "employee",
        dashboard: "dubai"
      }).select("_id");
      users = users.map((user) => user._id);
    } else if(room === "lahore-employees"){
      users = await User.find({ 
        role: "employee",
        dashboard: "lahore"
      }).select("_id");
      users = users.map((user) => user._id);
    } else if(room === "all-admins"){
      users = await User.find({ 
        $or: [
          { role: "admin" },
          { role: "superadmin" },
        ] 
      }).select("_id");
      users = users.map((user) => user._id);
    } else if(room === "admins"){
      users = await User.find({ 
        role: "admin" 
      }).select("_id");
      users = users.map((user) => user._id);
    } else if(room === "superadmins"){
      users = await User.find({ 
        role: "superadmin" 
      }).select("_id");
      users = users.map((user) => user._id);
    }

    const newNotification = new Notifications({
      user: users,
      whichUser: actionUser,
      message: message,
      title: title,
      onClick: onClick,
      seen: false,
      image: image,
    });
    await newNotification.save();
    io.to(room).emit('newNotification', newNotification);
  } catch (error) {
    console.error("Error creating notifications:", error);
  }
}
module.exports = { createNotification, createRoomNotification };
