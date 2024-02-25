const mongoose = require("mongoose");
const { Schema } = mongoose;

const inventorySchema = new Schema(
    {
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
        selectItem:{
            type:String,
        }
    },
    {
        timestamps: true,
    }
);

const Inventory = mongoose.model("inventory", inventorySchema);
module.exports = Inventory;
