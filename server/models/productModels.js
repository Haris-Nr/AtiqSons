const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
    {
        sku:{
            type:String,
            required:true,
            unique: true
        
        },
        productName: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
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
        pastmonth: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        bestseller: {
            type: String,
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
            required: true,
        },
        seller: {
            type: String,
            required: true,
        },
        employeeName:{
            type:String,
            required:true,
        },
        tracking: {
            type: String,
            enum: ["tracking", "tracked", "pending"],
            default: "tracking",
        },
        selectItem:{
            type:String,
            enum:["priority","seasonal","holding","tracking"],
            required:true
        },
        company:{
            type:String,
            enum:["amazon","noon"],
            required:true,
        },
        seasonalCategory:{
            type:String,
            enum:["winter","summer","ramzan","halloween","christmas","diwali","holi"]
            
        }

    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("products", productSchema);
module.exports = Product;
