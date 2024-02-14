const Log = require("../models/logModel");

const getAllLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skipIndex = (page - 1) * limit;

        const allLogs = await Log.find()
            .populate({
                path: "user_id",
                match: { role: "employee" },
            })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skipIndex)
            .exec();

        const filteredLogs = allLogs.filter((log) => log.user_id);

        const totalCount = await Log.countDocuments({
            user_id: { $in: filteredLogs.map((log) => log.user_id) },
        });

        res.status(200).json({
            success: true,
            data: filteredLogs,
            pageInfo: {
                totalItems: totalCount,
                currentPage: page,
                itemsPerPage: limit,
                totalPages: Math.ceil(totalCount / limit),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteAllLogs = async (req, res) => {
    try {
        const date30DaysAgo = new Date(
            new Date().setDate(new Date().getDate() - 30)
        );

        await Log.deleteMany({
            createdAt: { $lt: date30DaysAgo },
        });

        res
            .status(200)
            .send("Logs older than 30 days have been deleted successfully.");
    } catch (error) {
        console.error("Failed to delete logs:", error);
        res.status(500).send("Error deleting logs.");
    }
};

module.exports = { getAllLogs, deleteAllLogs };
