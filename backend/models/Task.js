const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide description"],
      trim: true,
    },
    status: {
      type: String,
      default: "todo",
      enum: ["todo", "inprogress", "finished"],
    },
    priority: {
      type: String,
      default: "normal",
      enum: ["low", "normal", "high"],
    },
    users: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Task", TaskSchema);
