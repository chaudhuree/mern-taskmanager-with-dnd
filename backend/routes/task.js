const express =require("express");

const router = express.Router();

// middlewares
const {authenticated,admin}= require("../middleware/authentication.js") ;

// controllers
const {
  addTask,
  getAllTasks,
  getTasksByUser,
  getTask,
  updateTask,
  changeTaskStatus,
  deleteTask,
  addUsersToTask,
  removeUsersFromTask,
  getTasksByStatus,
  getTasksByPriority

} =require("../controllers/task.js");

router.post("/task", addTask);
router.get("/tasks", getAllTasks);
router.get("/tasks/user/:userID", getTasksByUser);
router.get("/task/:id", getTask);
router.put("/task/:id", updateTask);
router.put("/task/status/:id", changeTaskStatus);
router.delete("/task/:id", deleteTask);
router.put("/task/users/:taskID", addUsersToTask);
router.delete("/task/users/:taskID", removeUsersFromTask);
router.get("/tasks/status/:status", getTasksByStatus);
router.get("/tasks/priority/:priority", getTasksByPriority);

module.exports= router;