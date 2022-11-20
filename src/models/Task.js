const { Schema, model, model } = require("mongoose");

const taskSchema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    status: { type: String, Default: "New" },
    email: { type: String },
  },
  { timeStamp: true }
);

const Task = model("Task", taskSchema);
module.exports = Task;
