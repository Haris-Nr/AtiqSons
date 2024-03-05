const mongoose = require("mongoose");
const { Schema } = mongoose;

const trackSchema = new Schema(
    {
        productId:{
            type: Schema.Types.ObjectId,
            ref: "products",
            required: true,
        },
        sale:{
            type:Number,
            required:true,
        },
    },
    {
        timestamps: true,
    }
);

const Track = mongoose.model("tracks", trackSchema);
module.exports = Track;
