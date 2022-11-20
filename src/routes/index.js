const router = require("express").Router();

// user controller
const {
  register,
  login,
  updateProfile,
} = require("../controllers/UserController");
const {
  createTask,
  updateTask,
  deleteTask,
  listTaskByStatus,
  taskCountByStatus,
} = require("../controllers/TaskController");

// authverify middleware
const authVerifyMiddleware = require("../middleware/AuthVerifyMiddleware");

// user router
router.post("/user/register", register);
router.post("/user/login", login);
router.post("/user/update", authVerifyMiddleware, updateProfile);

// task router
router.post("/task/create", authVerifyMiddleware, createTask);
router.get("/task/delete/:id", authVerifyMiddleware, deleteTask);
router.get("/task/update/:id/:status", authVerifyMiddleware, updateTask);
router.get(
  "/task/listTaskByStatus/:status",
  authVerifyMiddleware,
  listTaskByStatus
);

router.get("/task/taskCountByStatus", authVerifyMiddleware, taskCountByStatus);
module.exports = router;
