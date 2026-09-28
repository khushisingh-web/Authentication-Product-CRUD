const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
} = require("../controllers/authController");

const registerValidator = require("../validators/registerValidator");

const router = express.Router();

router.post("/register", registerValidator, registerUser);

router.post("/login", loginUser);

router.post("/refresh-token", refreshAccessToken);

router.post("/logout", authMiddleware, logoutUser);

router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
