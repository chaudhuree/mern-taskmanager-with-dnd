const Task = require("../models/Task");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");


// add task
exports.addTask = async (req, res) => {
  const task = await Task.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ task });
};

// get all tasks
exports.getAllTasks = async (req, res) => {
  const tasks = await Task.find({}).populate("users").populate("createdBy").sort("-createdAt");
  res.status(StatusCodes.OK).json({ tasks });
};

// get single task
exports.getTask = async (req, res) => {
  const { id: taskID } = req.params;
  const task = await Task.findOne({ _id: taskID }).populate("users").populate("createdBy");
  if (!task) {
    throw new BadRequestError("No task found with this ID");
  }
  res.status(StatusCodes.OK).json({ task });
}

// update task
exports.updateTask = async (req, res) => {
  const { id: taskID } = req.params;
  const task = await Task.findOneAndUpdate({ _id: taskID }, req.body
    , { new: true, runValidators: true });
  if (!task) {
    throw new BadRequestError("No task found with this ID");
  }
  res.status(StatusCodes.OK).json({ task });
}

// delete task
exports.deleteTask = async (req, res) => {
  const { id: taskID } = req.params;
  const task = await Task.findOneAndDelete({ _id: taskID });
  if (!task) {
    throw new BadRequestError("No task found with this ID");
  }
  res.status(StatusCodes.OK).send("Task deleted successfully");
}

// add user to task
exports.addUserToTask = async (req, res) => {
  const { taskID, userID } = req.params;
  const task = await Task.findOneAndUpdate({ _id: taskID }, { $push: { users: userID } }, { new: true });
  if (!task) {
    throw new BadRequestError("No task found with this ID");
  }
  res.status(StatusCodes.OK).json({ task });
}

// add users to task
exports.addUsersToTask = async (req, res) => {
  const { taskID } = req.params;
  const { users } = req.body;
  const task = await Task.findOneAndUpdate({ _id: taskID }, { $push: { users: { $each: users } } }, { new: true });
  if (!task) {
    throw new BadRequestError("No task found with this ID");
  }
  res.status(StatusCodes.OK).json({ task });
}

// remove user from task
exports.removeUserFromTask = async (req, res) => {
  const { taskID, userID } = req.params;
  const task = await Task.findOneAndUpdate({ _id: taskID }, { $pull: { users: userID } }, { new: true });
  if (!task) {
    throw new BadRequestError("No task found with this ID");
  }
  res.status(StatusCodes.OK).json({ task });
}

// remove users from task
exports.removeUsersFromTask = async (req, res) => {
  const { taskID } = req.params;
  const { users } = req.body;
  const task = await Task.findOneAndUpdate({ _id: taskID }, { $pull: { users: { $in: users } } }, { new: true });
  if (!task) {
    throw new BadRequestError("No task found with this ID");
  }
  res.status(StatusCodes.OK).json({ task });
}

// get tasks by user(assigned to a user)
exports.getTasksByUser = async (req, res) => {
  const { userID } = req.params;
  const tasks = await Task.find({ users: userID }).populate("users").populate("createdBy").sort("-createdAt");
  res.status(StatusCodes.OK).json({ tasks });
}

// get tasks by status
exports.getTasksByStatus = async (req, res) => {
  const { status } = req.params;
  const tasks = await Task.find({ status }).populate("users").populate("createdBy").sort("-createdAt");
  res.status(StatusCodes.OK).json({ tasks });
}

// get tasks by priority
exports.getTasksByPriority = async (req, res) => {
  const { priority } = req.params;
  const tasks = await Task.find({ priority }).populate("users").populate("createdBy").sort("-createdAt");
  res.status(StatusCodes.OK).json({ tasks });
}

// change task status
exports.changeTaskStatus = async (req, res) => {
  const { id: taskID } = req.params;
  const { status } = req.body;
  const task = await Task.findOneAndUpdate({
    _id: taskID
  }, {
    status
  }, {
    new: true,
    runValidators: true
  });
  if (!task) {
    throw new BadRequestError("No task found with this ID");
  }
  res.status(StatusCodes.OK).json({ task });
}