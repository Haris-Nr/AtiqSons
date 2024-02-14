const mongoose = require('mongoose');


const breakSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    isLeave: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('break', breakSchema)