const mongoose = require('mongoose');

const { Schema } = mongoose;

const activityLogSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60*60*24*30,  // 30 days
    },
});

const ActivityLog = mongoose.model('activityLogs', activityLogSchema);

module.exports = ActivityLog;