const mongoose = require("mongoose");
const { Schema } = mongoose;

const dubaiSchema = new Schema(
    {
        productName: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        asin: {
            type: Schema.Types.Mixed,
            required: true,
            unique: true,
        },
        price: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Dubai = mongoose.model("dubai", dubaiSchema);
module.exports = Dubai;
