const express = require("express");
const { UserModel } = require("../models/User/User");
const { default: mongoose } = require("mongoose");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing users
 *
 * /api/v1/users:
 *
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *
 *
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to update
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 * 
 * 
 *   get:
 *     summary: Retrieve a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to update
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 * 
 * 
 * /api/v1/users/get-count:
 *
 *   get:
 *     summary: Get the total users count
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A Count of users
 * 
 */

//Retrieve all Users
router.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find()
      .populate("address")
      .select("-password_hash")
      .sort({
        created_at: -1,
      });
    // console.log("users", users);

    const userCount = await UserModel.countDocuments(users);

    // Transform the users array to replace null with an empty object in the address field
    const transformedUsers = users.map((user) => {
      return {
        ...user.toObject(),
        address: user.address || {}, // Replace null with an empty object
      };
    });

    res.status(200).json({
      success: true,
      responseData: transformedUsers,
      total: userCount,
      responseMessage: "Successful",
      responseCode: "00",
    });
  } catch (error) {
    console.error("Error fetching products", error);
    res.status(500).send({
      success: false,
      error: "Internal Server Error",
      responseMessage: "Failed",
      responseCode: "99",
    });
  }
});


//Retrieve Users count
router.get("/get-count", async (req, res, next) => {
  try {
    const userCount = await UserModel.countDocuments();
    // console.log("userCount", userCount);

    res.status(200).json({
      success: true,
      responseData: userCount,
      responseMessage: "Successful",
      responseCode: "00",
    });
  } catch (error) {
    console.error("Error fetching users count", error);
    res
      .status(500)
      .send({
        success: false,
        error: "Internal Server Error",
        responseMessage: "Failed",
        responseCode: "99",
      });
  }
});


//Update a User
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const existingUser = await UserModel.findById(id)
      .populate("address")
      .sort({ created_at: -1 });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    Object.assign(existingUser, req.body);

    // Set the updated_at field to the current date
    existingUser.updated_at = new Date();

    const updatedUser = await existingUser.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
      responseMessage: "Successful",
      responseCode: "00",
    });
  } catch (error) {
    console.error("Error updating user", error);
    res.status(500).send({
      success: false,
      error: "Internal Server Error",
      responseMessage: "Failed",
      responseCode: "99",
    });
  }
});


//Retrieve a User by ID
router.get("/:id", async(req, res, next) => {
  try {
    const { id } = req.params;

    // Check if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Find the user by ID and populate the address field
    const user = await UserModel.findById(id)
      .populate("address")
      .select("-password_hash")
      .sort({
        created_at: -1,
      });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Transform the user object to replace null with an empty object in the address field
    const transformedUser = {
      ...user.toObject(),
      address: user.address || {}, // Replace null with an empty object
    };


    res.status(200).json({
      success: true,
      responseData: transformedUser,
      responseMessage: "Successful",
      responseCode: "00",
    });
  } catch (error) {
     console.error("Error fetching user by ID", error);
     res.status(500).send({
       success: false,
       error: "Internal Server Error",
       responseMessage: "Failed",
       responseCode: "99",
     });
  }
})


module.exports = router;
