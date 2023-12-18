const mongoose = require("mongoose");
const { Schema, model } = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         review_id:
 *           type: string
 *           format: ObjectId
 *           description: The ID of the review.
 *         user_id:
 *           type: string
 *           format: ObjectId
 *           description: The ID of the user who wrote the review.
 *         product_id:
 *           type: string
 *           format: ObjectId
 *           description: The ID of the product being reviewed.
 *         rating:
 *           type: number
 *           description: The rating given in the review.
 *         review_text:
 *           type: string
 *           description: The text content of the review.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the review was created.
 */

const ReviewSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  rating: { type: Number, default: 0, required: true },
  review_text: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const ReviewModel = model("Review", ReviewSchema);

module.exports = ReviewModel;
