const schedule = require('node-schedule');
const Task = require('../models/taskModels');

const job = schedule.scheduleJob('0 0 5 * * *', async function() {
  try {
    const result = await Task.updateMany(
      { tasktype: 'daily', status: 'complete' },
      { $set: { status: 'incomplete' } }
    );

    console.log(`Daily tasks reset: ${result.modifiedCount} task(s) updated.`);
  } catch (error) {
    console.error('Error resetting daily tasks:', error);
  }
});

module.exports = job;
