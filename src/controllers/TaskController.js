const Task = require("../models/Task");

exports.createTask = async (req, res, next) => {
  let { title, description, status } = req.body;
  let email = req.email;

  try {
    let task = new Task({ title, description, status, email });
    await task.save();

    res.status(201).json({
      success: "success",
      message: "Task saved successfully",
    });
  } catch (err) {
    res.status(400).json({ message: err.message, status: "fail" });
  }
};

exports.deleteTask = async (req, res, next) => {
  let id = req.params.id;

  try {
    let query = { _id: id };
    await Task.findOneAndDelete(query);
    res.status(200).json({
      success: "success",
      message: "Task deleted successfully",
    });
  } catch (err) {
    res.status(400).json({ message: err.message, status: "fail" });
  }
};

exports.updateTask = async (req, res, next) => {
  let id = req.params.id;
  let status = req.params.status;

  try {
    let query = { _id: id };
    let body = { status: status };
    await Task.findOneAndUpdate(query, body);
    res.status(200).json({
      success: "success",
      message: "Task updated successfully",
    });
  } catch (err) {
    res.status(400).json({ message: err.message, status: "fail" });
  }
};

exports.listTaskByStatus = async (req, res, next) => {
  let status = req.params.status;
  let email = req.email;
  try {
    let tasks = await Task.aggregate([
      { $match: { email: email, status: status } },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          status: 1,
          createdAt: {
            $dateToString: {
              date: "$createdAt",
              format: "%d-%m-%Y",
            },
          },
        },
      },
    ]);

    res.status(200).json({
      success: "success",
      data: tasks,
    });
  } catch (err) {
    res.status(400).json({ message: err.message, status: "fail" });
  }
};

exports.taskCountByStatus = async (req, res, next) => {
  let email = req.email;

  try {
    let data = await Task.aggregate([
      { $match: { email: email } },
      { $group: { _id: "$status", sum: { $count: {} } } },
    ]);

    res.status(200).json({
      success: "success",
      data,
    });
  } catch (err) {
    res.status(400).json({ message: err.message, status: "fail" });
  }
};
