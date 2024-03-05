const mongoose = require("mongoose");
const { Schema } = mongoose;
const flexSchema = new Schema(
  {
    priceAed: {
      type: String,
    },
    cargo: {
        type: String,
    },
    totalAmount: {
        type: Number,
    },
    rateRMB: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Flex = mongoose.model("flex", flexSchema);
module.exports = Flex;
