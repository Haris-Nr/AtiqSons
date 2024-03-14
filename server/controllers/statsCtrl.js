const Product = require("../models/productModels");
const Task = require("../models/taskModels");
const User = require("../models/userModel");

// Utility functions to calculate the start and end dates
const getStartEndDate = (timeFrame) => {
    const now = new Date();
    let start, end;
    
    switch (timeFrame) {
        case "week":
            const first =
            now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1);
            start = new Date(now.setDate(first));
            end = new Date(start.getTime());
            end.setDate(start.getDate() + 6);
            break;
        case "month":
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            break;
        case "year":
            start = new Date(now.getFullYear(), 0, 1);
            end = new Date(now.getFullYear() + 1, 0, 0);
            break;
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return { start, end };
};

const productInfo = async (req, res) => {
    try {
        const { timeFrame } = req.query;

        const { start, end } = getStartEndDate(timeFrame);

        const approvedCount = await Product.countDocuments({ status: "approved" });
        const rejectedCount = await Product.countDocuments({ status: "rejected" });
        const pendingCount = await Product.countDocuments({ status: "pending" });
        const holdingCount = await Product.countDocuments({
            selectItem: "holding",
        });
        const trackingCount = await Product.countDocuments({
          tracking: "tracking",
        });
        const seasonalCount = await Product.countDocuments({
            selectItem: "seasonal",
        });
        const priorityCount = await Product.countDocuments({
            selectItem: "priority",
        });
        const totalproduct = await Product.countDocuments({});

        const amazonStats = await Product.aggregate([
            { $match: { company: "amazon", createdAt: { $gte: start, $lte: end } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
            { $sort: { "_id": 1 } }
        ]);

        const noonStats = await Product.aggregate([
            { $match: { company: "noon", createdAt: { $gte: start, $lte: end } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
            { $sort: { "_id": 1 } }
        ]);


        res.json({
            noonStats,
            amazonStats,
            approvedCount,
            rejectedCount,
            pendingCount,
            holdingCount,
            trackingCount,
            seasonalCount,
            priorityCount,
            totalproduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
};

const getCompletedDailyTasksWithEmployeeDetails = async (req, res) => {
    try {
        const tasksStats = await Task.aggregate([
          {
            $match: {
              tasktype: 'daily', // Consider only daily tasks
            }
          },
          {
            $lookup: {
              from: 'users', // Ensure this matches your users collection name
              localField: 'employee',
              foreignField: '_id',
              as: 'employeeDetails'
            }
          },
          {
            $unwind: '$employeeDetails' // Flatten the array
          },
          {
            $group: {
              _id: '$employee',
              totalDailyTasks: { $sum: 1 }, // Count total daily tasks assigned
              completedTasks: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'complete'] }, 1, 0] // Count only completed tasks
                }
              },
              employeeDetails: { $first: '$employeeDetails' } // Keep employee details
            }
          },
          {
            $project: {
              _id: 0,
            //   employeeId: '$_id',
              employeeName: '$employeeDetails.fullname',
              totalDailyTasks: 1,
              completedTasks: 1,
              // You can include more fields from employeeDetails if needed
            }
          }
        ]);
    
        res.json(tasksStats);
      } catch (error) {
        console.error('Error fetching daily task statistics by employee:', error);
        res.status(500).json({ success: false, message: "An error occurred while fetching the task statistics." });
      }
  };



module.exports = {
    productInfo,
    getCompletedDailyTasksWithEmployeeDetails
}