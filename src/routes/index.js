const router = require("express").Router();

// user controller
const {
  register,
  login,
  updateProfile,
} = require("../controllers/UserController");

// authverify middleware
const authVerifyMiddleware = require("../middleware/AuthVerifyMiddleware");

// user router
router.post("/user/register", register);
router.post("/user/login", login);
router.post("/user/update", authVerifyMiddleware, updateProfile);
module.exports = router;
