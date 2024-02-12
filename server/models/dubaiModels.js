const mongoose = require("mongoose");
const { Schema } = mongoose;

const dubaiSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "products",
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
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
        reserve: {
            type: Number,
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Dubai = mongoose.model("dubai", dubaiSchema);
module.exports = Dubai;
