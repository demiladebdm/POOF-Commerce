const express = require("express");
const ProductImageModel = require("../models/Product/ProductImage");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ProductImages
 *   description: API endpoints for managing Product Images
 *
 * /api/v1/product-images:
 *
 *   get:
 *     summary: Retrieve a list of Product Images
 *     tags: [ProductImages]
 *     responses:
 *       200:
 *         description: A list of Product Images
 *
 *   post:
 *     summary: Create a new Product Image
 *     tags: [ProductImages]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductImage'
 *     responses:
 *       201:
 *         description: Product Image created successfully
 *       400:
 *         description: Invalid input
 * 
 * 
 * /api/v1/product-images/{id}:
 * 
 *   get:
 *     summary: Retrieve a Product Images by ID
 *     tags: [ProductImages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product image to retrieve
 *     responses:
 *       200:
 *         description: A list of Product Images
 *       404:
 *         description: Product Image not found
 * 
 *   put:
 *     summary: Update a Product Image
 *     tags: [ProductImages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product image to update
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductImage'
 *     responses:
 *       201:
 *         description: Product Image updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product Image not found
 * 
 *   delete:
 *     summary: Delete a product image by ID
 *     tags: [ProductImages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product image to delete
 *     responses:
 *       200:
 *         description: Product Image deleted successfully
 *       404:
 *         description: Product Image not found
 *       500:
 *         description: Internal Server Error
 */

router.get("/", async (req, res, next) => {
  try {
    const productImages = await ProductImageModel.find().sort({
      created_at: -1,
    });
    // console.log("productImages", productImages);
    res
      .status(200)
      .json({
        success: true,
        responseData: productImages,
        responseMessage: "Successful",
        responseCode: "00",
      });
  } catch (error) {
    console.error("Error fetching Product Images", error);
    res
      .status(500)
      .send({
        success: false,
        error: "Internal Server Error",
        responseMessage: "Successful",
        responseCode: "00",
      });
  }
});

module.exports = router;
