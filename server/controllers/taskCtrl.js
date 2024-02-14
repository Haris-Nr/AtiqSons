const Task = require("../models/taskModels");
const User = require("../models/userModel");
const { createNotification } = require("../util/notification");


const createTask = async (req, res) => {
  try {
    const newTask = new Task(req.body);

    await newTask.save();

    // Retrieve user information for notification
    const user = await User.find(newTask.createdBy);

    // Get the Socket.IO instance from the app
    const io = req.app.get('io');

    // Create notification
    await createNotification(
      io,
      "employee",
      null,
      `New task assigned by ${user[0].role}`,
      "New Task",
      user[0].fullname,
      // Assuming newTask.image[0].url is valid; adjust accordingly
      `${newTask.taskDetails}`,
      `${newTask._id}`,
    );

    res.status(201).json({
      success: true,
      message: "Task Assigned",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found for deletion" });
    }

    res.status(200).send("Task has been deleted!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTask = async (req, res) => {
  try {
    const foundTask = await Task.findById(req.params.id);

    if (!foundTask) {
      console.error("Task not found");
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(foundTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const fetchTasksAllemployee = async (req, res) => {
  try {

    const tasks = await Task.find().populate("employee", "fullname");

    return res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};



const fetchTasksForEmployee = async (req, res) => {
  try {
      // If not an admin, proceed with fetching tasks for the specific user
      const userId = req.body.userId; // Assuming you send userId in the request body
      const tasks = await Task.find({ employee: userId }).sort({ createdAt: -1 });

      return res.json({
        success: true,
        data: tasks,
      });
    } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const changeTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, {
      status,
    });

    const employee = await User.findById(req.body.userId);
    // send notification to task assignee or relevant users
    const io = req.app.get('io');
    await createNotification(
      io,
      null,
      updatedTask.assigneeId, // Update this with the appropriate field for task assignee
      `Admin task ${updatedTask.taskDetails} is now ${status} by ${employee.fullname}`,
      "Task Status Updated",
      employee.fullname,
      // You can add additional details for the notification related to the task
      // For example: `${updatedTask.someField}`,
      // `${updatedTask._id}`,
    );

    res.json({
      success: true,
      message: "Task status updated successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};




module.exports = {
  createTask,
  deleteTask,
  getTask,
  fetchTasksForEmployee,
  changeTaskStatus,
  fetchTasksAllemployee
};
