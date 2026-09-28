const bcrypt = require("bcryptjs");
const UserModel = require("../models/userModel");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email,
      passwordHash,
    });

    return res.status(201).json({
      message: "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Register error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );

    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      message: "Login successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log("Login error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token is required",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await UserModel.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );

    return res.status(200).json({
      message: "Access token refreshed successfully",
      accessToken,
    });
  } catch (error) {
    console.log("Refresh token error:", error);

    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token is required",
      });
    }

    const user = await UserModel.findOne({ refreshToken });

    if (!user) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    user.refreshToken = null;
    await user.save();

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.log("Logout error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select(
      "-passwordHash -refreshToken",
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User details fetched successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Get current user error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};



module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
};