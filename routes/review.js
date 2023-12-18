const express = require("express");
const ReviewModel = require("../models/Review/Review");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API endpoints for managing reviews
 *
 * /api/v1/reviews:
 *
 *   get:
 *     summary: Retrieve a list of reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: A list of reviews
 *
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Invalid input
 */

router.get("/", async (req, res, next) => {
  try {
    const reviews = await ReviewModel.find().sort({
      created_at: -1,
    });
    // console.log("reviews", reviews);
    res
      .status(200)
      .json({
        success: true,
        responseData: reviews,
        responseMessage: "Successful",
        responseCode: "00",
      });
  } catch (error) {
    console.error("Error fetching orders", error);
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
