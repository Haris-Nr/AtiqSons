const mongoose = require("mongoose");
const { Schema } = mongoose;

const inventorySchema = new Schema(
    {
        productName: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
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
        currency: {
            type: String,
            required: true,
            enum: ["$","AED","SAU"],
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

const Inventory = mongoose.model("inventory", inventorySchema);
module.exports = Inventory;
