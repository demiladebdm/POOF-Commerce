const express = require("express");
const ProductVideoModel = require("../models/Product/ProductVideo");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ProductVideos
 *   description: API endpoints for managing Product Videos
 *
 * /api/v1/product-videos:
 *
 *   get:
 *     summary: Retrieve a list of Product Videos
 *     tags: [ProductVideos]
 *     responses:
 *       200:
 *         description: A list of Product Videos
 *
 *   post:
 *     summary: Create a new Product Video
 *     tags: [ProductVideos]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductVideo'
 *     responses:
 *       201:
 *         description: Product Video created successfully
 *       400:
 *         description: Invalid input
 * 
 * 
 * /api/v1/product-videos/{id}:
 * 
 *   get:
 *     summary: Retrieve a Product Video by ID
 *     tags: [ProductVideos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product video to retrieve
 *     responses:
 *       200:
 *         description: A list of Product Videos
 *       404:
 *         description: Product Video not found
 * 
 *   put:
 *     summary: Update a new Product Video
 *     tags: [ProductVideos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product video to update
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductVideo'
 *     responses:
 *       201:
 *         description: Product Video updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product Video not found
 * 
 *   delete:
 *     summary: Delete a product video by ID
 *     tags: [ProductVideos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product video to delete
 *     responses:
 *       200:
 *         description: Product Video deleted successfully
 *       404:
 *         description: Product Video not found
 *       500:
 *         description: Internal Server Error
 */

router.get("/", async (req, res, next) => {
  try {
    const productVideos = await ProductVideoModel.find().sort({
      created_at: -1,
    });
    // console.log("productVideos", productVideos);
    res
      .status(200)
      .json({
        success: true,
        responseData: productVideos,
        responseMessage: "Successful",
        responseCode: "00",
      });
  } catch (error) {
    console.error("Error fetching Product Videos", error);
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
