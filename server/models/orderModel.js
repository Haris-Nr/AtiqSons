const mongoose = require("mongoose");

const { Schema } = mongoose;


const orderSchema = new Schema({
    sku: {
        type: String,
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    picture: {
        type: String,
        required: true,
    },
    status:{
        type: String,
        enum: ['PENDING', 'PROCESSING', 'IN TRANSIT', 'DELIVERED', 'CANCELLED'],
        default: 'PENDING',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("orders", orderSchema);