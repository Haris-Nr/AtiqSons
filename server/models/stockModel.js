const mongoose = require("mongoose");
const { Schema } = mongoose;

const stockSchema = new Schema(
    {
        sku: {
            type: String,
        },
        productName: {
            type: String,
        },
        quantity: {
            type: String,
        },
        image: {
            type: String,
        },
        asin: {
            type: String,
        },
        price: {
            type: String,
        },
        selectItem: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Stock = mongoose.model("stock", stockSchema);
module.exports = Stock;
