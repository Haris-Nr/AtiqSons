const mongoose = require("mongoose");
const { Schema } = mongoose;
const taskSchema = new Schema(
  {
    taskDetails: {
      type: String,
      required: true,
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    status: {
      type: String,
      enum: ["incomplete", "complete"],
      default: "incomplete",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      required:true
    },
    tasktype:{
      type: String,
      enum:["daily","onetime"],
      required: true,
    },
    dueDate: {
      type: Date, 
      required:true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("task", taskSchema);
module.exports = Task;
