const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const fullfilmentSchema = new Schema(
  {
    sku:{
      type:String,
    },
    asin: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    store: {
      type: String,
    },
    stockStatus: {
      type: String,
    },
    remarks: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Fullfilment = model("Fullfilemt", fullfilmentSchema);

module.exports = Fullfilment;
