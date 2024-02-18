const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const screenShotSchema = new Schema({
    screenShot: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
},{
    timestamps: true
});


module.exports = mongoose.model('ScreenShot', screenShotSchema);