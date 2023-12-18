const express = require("express");
const CategoryModel = require("../models/Product/Category");
const { default: mongoose } = require("mongoose");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API endpoints for managing categories
 *
 * /api/v1/categories:
 *
 *   get:
 *     summary: Retrieve a list of categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of categories
 *
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid input
 * 
 * 
 * /api/v1/categories/{id}:
 * 
 *   get:
 *     summary: Retrieve a Category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category to retrieve
 *     responses:
 *       200:
 *         description: A single Category by ID
 *       404:
 *         description: Category not found
 * 
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category to delete
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Category updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Category not found
 * 
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category to delete
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal Server Error
 */


//Retrieve all categories
router.get("/", async (req, res, next) => {
  try {
    const categories = await CategoryModel.find().sort({ created_at: -1 });
    // console.log("categories", categories);
    res
      .status(200)
      .json({
        success: true,
        responseData: categories,
        responseMessage: "Successful",
        responseCode: "00",
      });
  } catch (error) {
    console.error("Error fetching categories", error);
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


//Create a category
router.post("/", async (req, res, next) => {
  try {
    const { name, description, created_by } = req.body;

    if (!name || !created_by) {
      return res.status(400).json({ success: false, error: "Name and Created_by are required" });
    }

    const newCategory = new CategoryModel({
      name,
      description,
      created_by
    });

    const savedCategory = await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: savedCategory,
      responseMessage: "Successful",
      responseCode: "00",
    });
  } catch (error) {
    console.error("Error creating categories", error);
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


//Retrieve a User by ID
router.get("/:id", async(req, res, next) => {
  try {
    const { id } = req.params;

    // Check if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid category ID format" });
    }

    // Find the category by ID
    const category = await CategoryModel.findById(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res
      .status(200)
      .json({
        success: true,
        responseData: category,
        responseMessage: "Successful",
        responseCode: "00"
      });
  } catch (error) {
     console.error("Error fetching category by ID", error);
     res
       .status(500)
       .send({
         success: false,
         error: "Internal Server Error",
         responseMessage: "Failed",
         responseCode: "99"
       });
  }
})


//Update a category by ID
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid category ID format" });
    }

    const existingCategory = await CategoryModel.findById(id);

    if (!existingCategory) {
      return res.status(404).json({ success: false, error: "Category not found" });
    }

    // Update only the fields that are provided in the request body
    Object.assign(existingCategory, req.body);

    // Set the updated_at field to the current date
    existingCategory.updated_at = new Date();

    const updatedCategory = await existingCategory.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
      responseMessage: "Successful",
      responseCode: "00"
    });
  } catch (error) {
    console.error("Error updating category", error);
    res
      .status(500)
      .send({
        success: false,
        error: "Internal Server Error",
        responseMessage: "Failed",
        responseCode: "99"
      });
  }
});


//Deleting a Category
router.delete("/:id", async(req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid category ID format" });
    }

    const result = await CategoryModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: "Category not found" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Category deleted successfully",
        responseMessage: "Successful",
        responseCode: "00"
      });
  } catch (error) {
    console.error("Error deleting category", error);
    res
      .status(500)
      .send({
        success: false,
        error: "Internal Server Error",
        responseMessage: "Failed",
        responseCode: "99"
      });
  }
})


module.exports = router;
