const Task = require("../models/taskModels");
const User = require("../models/userModel");
const { createNotification } = require("../util/notification");


const createTask = async (req, res) => {
  try {
    const newTask = new Task(req.body);

    await newTask.save();
    
    const user = await User.findById(newTask.employee);
    const admin = await User.findById(req.body.userId)

    const io = req.app.get('io');

    await createNotification(
      io,
      null,
      user._id,
      `New task assigned by ${admin.role}`,
      "New Task",
      admin.fullname,
      null,
      `task`,
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
      throw new Error( "Task not found for deletion" );
    }

    res.status(200).json({
      success: true,
      message:"Task deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: true,
      message:error.message
    });
  }
};


const fetchTasksAllemployee = async (req, res) => {
  try {

    const tasks = await Task.find().populate("employee", "fullname").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
   res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const fetchTasksForEmployee = async (req, res) => {
  try {
      const userId = req.body.userId;
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
    },{new:true});

    const employee = await User.findById(req.body.userId);

    const io = req.app.get('io');

    await createNotification(
      io,
      'admin',
      null,
      `Task completed by ${employee.fullname}`,
      "Task Status Updated",
      employee.fullname,
      null,
      'admintask'
    );
    await createNotification(
      io,
      'superadmin',
      null,
      `Task completed by ${employee.fullname}`,
      "Task Status Updated",
      employee.fullname,
      null,
      'admintask'
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
  fetchTasksForEmployee,
  changeTaskStatus,
  fetchTasksAllemployee
};
