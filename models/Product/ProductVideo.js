const mongoose = require("mongoose");
const { Schema, model } = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductVideo:
 *       type: object
 *       properties:
 *         product_id:
 *           type: string
 *           format: ObjectId
 *           description: The ID of the product associated with the video.
 *         video_url:
 *           type: string
 *           description: The URL of the video.
 *         created_by:
 *           type: string
 *           description: The username of the creator.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the video was created.
 *         updated_by:
 *           type: string
 *           description: The username of the last updater.
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the video was last updated.
 */

const ProductVideoSchema = new Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  video_url: { type: String, required: true },
  created_by: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_by: { type: String },
  updated_at: { type: Date },
});

const ProductVideoModel = model("ProductVideo", ProductVideoSchema);

module.exports = ProductVideoModel;
