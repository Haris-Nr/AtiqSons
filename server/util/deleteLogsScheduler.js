const schedule = require('node-schedule');
const Log = require("../models/logModel");

const deleteAllLogs = async () => {
    try {
        const date30DaysAgo = new Date(
            new Date().setDate(new Date().getDate() - 30)
        );

        await Log.deleteMany({
            createdAt: { $lt: date30DaysAgo },
        });

        console.log("Logs older than 30 days have been deleted successfully.");
    } catch (error) {
        console.error("Failed to delete logs:", error.message);
    }
};

const logJob = schedule.scheduleJob('0 0 3 * *', function() {
    console.log("Running scheduled log deletion task.");
    deleteAllLogs();
});

module.exports = logJob;