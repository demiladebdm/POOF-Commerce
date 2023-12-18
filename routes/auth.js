const express = require("express");
const { UserModel } = require("../models/User/User");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API endpoints for user authentication
 *
 * /api/v1/auth/register:
 *
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegistration'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or user already exists
 *
 * /api/v1/auth/login:
 *
 *   post:
 *     summary: Log in as an existing user
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized - Invalid credentials
 */

// Registration Route
router.post("/register", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      sex,
      phone_number,
    } = req.body;

    // Validate input
    if (
      !username ||
      !email ||
      !password ||
      !first_name ||
      !last_name ||
      !sex ||
      !phone_number
    ) {
      return res.status(400).json({
        success: false,
        error: "All fields are required for registration",
      });
    }

    // Check if the user exists
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "Username or email already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new UserModel({
      username,
      email,
      password_hash: hashedPassword,
      first_name,
      last_name,
      sex,
      phone_number,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: savedUser,
      responseMessage: "Successful",
      responseCode: "00",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      responseMessage: "Failed",
      responseCode: "99",
    });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await UserModel.findOne({ email }).select(
      "-password_hash"
    );

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: false, error: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email });
    const secret = process.env.SECRET;

    if (!user) {
      return res
        .status(401)
        .json({ message: false, error: "Invalid credentials" });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: false, error: "Invalid Credentials" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        isVerified: user.is_verified,
      },
      secret,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token: token,
      user: userData,
      responseMessage: "Successful",
      responseCode: "00",
    });
  } catch (error) {
    console.error("Error loggin in user:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      responseMessage: "Failed",
      responseCode: "99",
    });
  }
});

module.exports = router;
