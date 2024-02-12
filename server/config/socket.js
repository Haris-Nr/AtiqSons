const socketIO = require("socket.io");
const decodeToken = require("../util/tokenDecoder");
const Log = require("../models/logModel");
const User = require("../models/userModel");
const Notifications = require("../models/notificationModel");
const { createNotification } = require("../util/notification");

let loggedInEmployeeCount = 0;
let loggedInAdminCount = 0;

module.exports = (server) => {
  
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: "*",
    },
  });

  let onlineEmployees = [];
  let onlineAdmins = [];

  const addUser = (userDetails, socketId) => {
    const { _id, role, fullname } = userDetails;
    const userId = _id.toString()
    const newUser = { userId, socketId, role, fullname };
    if (role === "employee") {
      onlineEmployees.push(newUser);
    } else if (role === "admin" || role === "superadmin") {
      onlineAdmins.push(newUser);
    }
  };

  const removeUser = (socketId) => {
    onlineEmployees = onlineEmployees.filter(
      (user) => user.socketId !== socketId
    );
    onlineAdmins = onlineAdmins.filter((user) => user.socketId !== socketId);
  };

  const getUser = async (userid) => {
    return await [...onlineEmployees, ...onlineAdmins].find(
      (user) => user.userId === userid
    );
  };

  io.on("connection", async (socket) => {

    const token = socket.handshake.auth.token;

    const userDetails = await decodeToken(token);

    addUser(userDetails, socket.id);

    socket.join(userDetails._id.toString());

    const updateAndNotifyAdmins = () => {
      onlineAdmins.forEach((admin) => {
        io.to(admin.socketId).emit("userCounts", loggedInEmployeeCount);
      });
    };

    if (userDetails.role === "employee") {
      loggedInEmployeeCount++;
      console.log(
        "Employee connected. Total employees:",
        loggedInEmployeeCount
      );
    } else if (userDetails.role === "admin" || userDetails.role === "superadmin") {
      loggedInAdminCount++;
      console.log("Admin connected. Total admins:", loggedInAdminCount);
    }

    updateAndNotifyAdmins();

    // const userConnectedNotification = {
    //   message: `${userDetails.fullname} is now online`,
    //   user: userDetails._id,
    // };
    // // Emit notification to all admins
    // onlineAdmins.forEach((admin) => {
    //   io.to(admin.socketId).emit("userStatusChange", userConnectedNotification);
    // });

    const user = await User.findById(userDetails._id);

    await Log.findOneAndUpdate(
      {
        user_id: user._id,
        action: "Login",
      },
      { $set: { logstatus: "Online" } },
      { new: true }
    );

   

    socket.on('fetchNotifications', async (userId) => {
        try {
            const notifications = await Notifications.find({ user: userId }).sort({ createdAt: -1 });
            io.to(userId).emit('notifications', notifications);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    });

    socket.on("unseenCount", async(userId)=>{
      try {
        const user = await getUser(userId);
        if (user) {
        const unseenCount = await Notifications.countDocuments({ user: userId, seen: false });
        io.to(user.userId).emit('unseenCount', unseenCount);
      }
      } catch (error) {
        console.error("Error fetching count:", error);
      }
     
    })


    socket.on('markNotificationAsSeen', async (notificationId) => {
      try {
        const updatedNotification = await Notifications.findByIdAndUpdate(notificationId, { seen: true }, { new: true });

        if (updatedNotification && updatedNotification.user) {
          for (const userId of updatedNotification.user) {
            const unseenCount = await Notifications.countDocuments({ user: userId, seen: false });
            io.to(userId.toString()).emit('unseenCount', unseenCount);
            const notifications = await Notifications.find({ user: userId }).sort({ createdAt: -1 });
            io.to(userId).emit('notifications', notifications);

          }
        }
      } catch (error) {
        console.error("Error marking notification as seen:", error);
      }
    });





    socket.on("disconnect", async () => {
      removeUser(socket.id);
      if (userDetails.role === "employee") {
        loggedInEmployeeCount--;
        console.log(
          "Employee disconnected. Total employees:",
          loggedInEmployeeCount
        );
      } else if (userDetails.role === "admin" || userDetails.role === "superadmin") {
        loggedInAdminCount--;
        console.log("Admin disconnected. Total admins:", loggedInAdminCount);
      }

      updateAndNotifyAdmins();

      // const userDisconnectedNotification = {
      //   message: `${user.fullname} is now offline`,
      //   user: user._id,
      // };
      // // Emit notification to all admins
      // onlineAdmins.forEach((admin) => {
      //   io.to(admin.socketId).emit("userStatusChange", userDisconnectedNotification);
      // });

      await Log.findOneAndUpdate(
        {
          user_id: user._id,
          action: "Login",
        },
        { $set: { logstatus: "Offline" } },
        { new: true }
      );
    });
  });

  return io;
};
