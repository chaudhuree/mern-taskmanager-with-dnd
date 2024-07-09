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
  updateTaskStatus,
  deleteTask,
  addUsersToTask,
  removeUsersFromTask,
  getTasksByStatus,
  getTasksByPriority

} =require("../controllers/task.js");

router.post("/task", authenticated,admin, addTask);
router.get("/tasks",authenticated,admin, getAllTasks);
router.get("/tasks/user/:userID",authenticated, getTasksByUser);
router.get("/task/:id", getTask);
router.put("/task/:id",authenticated,admin, updateTask);
router.put("/task/status/:id",authenticated, updateTaskStatus);
router.delete("/task/:id",authenticated,admin, deleteTask);
router.put("/task/users/:taskID", addUsersToTask);
router.delete("/task/users/:taskID", removeUsersFromTask);
router.get("/tasks/status/:status", getTasksByStatus);
router.get("/tasks/priority/:priority", getTasksByPriority);

module.exports= router;