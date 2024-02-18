const mongoose = require("mongoose");
const { Schema } = mongoose;

const inventorySchema = new Schema(
    {
        productName: {
            type: String,
            required: true,
        },
        quantity: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            },
        asin: {
            type: String,
            required: true,
            unique: true,
        },
        price: {
            type: String,
            required: true,
        },
        selectItem:{
            type:String,
            required:true
        }
    },
    {
        timestamps: true,
    }
);

const Inventory = mongoose.model("inventory", inventorySchema);
module.exports = Inventory;
