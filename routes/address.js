const express = require("express");
const mongoose = require("mongoose");
const AddressModel = require("../models/User/Address");
const { UserModel } = require("../models/User/User");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Address
 *   description: API endpoints for managing Address
 *
 * /api/v1/address/{user_id}:
 *
 *   get:
 *     summary: Retrieve user address
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to associate with the new address
 *     responses:
 *       200:
 *         description: User Address
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User address not found
 *
 *   post:
 *     summary: Create a user address
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to associate with the new address
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       201:
 *         description: User Address created successfully
 *       400:
 *         description: Invalid input
 *
 *
 * /api/v1/address/{user_id}/{id}:
 *   put:
 *     summary: Update a user address
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to associate with the new address
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the address to update
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: User Address updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Address not found
 */


//Retrieve a User Address
router.get("/:user_id", async (req, res, next) => {
  try {
    const { user_id } = req.params;

    // Check if user_id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ success: false, error: "Invalid user ID format" });
    }

    // Find the user by user_id
    const user = await UserModel.findById(user_id);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const address = await AddressModel.find({ user_id }).sort({ created_at: -1 });

    // console.log("address", address);
    res
      .status(200)
      .json({
        success: true,
        responseData: address,
        responseMessage: "Successful",
        responseCode: "00",
      });
  } catch (error) {
    console.error("Error fetching user address", error);
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


//Create a User Address
router.post("/:user_id", async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { street_address, city, state, postal_code, country } = req.body;

    // Check if user_id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ success: false, error: "Invalid user ID format" });
    }

    const existingUser = await UserModel.findOne({ _id: user_id });

    console.log("existing-user", existingUser);

    if (!existingUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Function to create a new address
    const newAddress = new AddressModel({
      user_id,
      street_address,
      city,
      state,
      postal_code,
      country,
    });

    const savedAddress = await newAddress.save();

    // Update the user's address field with the _id of the created address
    existingUser.address = savedAddress._id;
    await existingUser.save();

    res.status(201).json({
      success: true,
      message: "User Address created successfully",
      address: savedAddress,
      responseMessage: "Successful",
      responseCode: "00",
    });
  } catch (error) {
    console.error("Error creating user address", error);
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


//Update a User Address
router.put("/:user_id/:id", async (req, res, next) => {
  try {
    const { user_id, id } = req.params;
    // const { street_address, city, state, postal_code, country } = req.body;

    // Check if user_id and id are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ success: false, error: "Invalid user ID format" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid address ID format" });
    }

    const existingUser = await UserModel.findById(user_id);

    if (!existingUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const existingAddress = await AddressModel.findById(id);

    if (!existingAddress) {
      return res.status(404).json({ success: false, error: "Address not found" });
    }

    // Check if the request body is empty
    if (Object.keys(req.body).length === 0) {
      // return res.status(200).json({ message: "No updates provided" });
      return res.status(204).send({ status: true });
    }

    // Update only the fields that are provided in the request body
    Object.assign(existingAddress, req.body);
    
    const updatedAddress = await existingAddress.save();

    res.status(200).json({
      success: true,
      message: "User Address updated successfuly",
      address: updatedAddress,
      responseMessage: "Successful",
      responseCode: "00",
    });
  } catch (error) {
    console.error("Error updating user address", error);
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

module.exports = router;
