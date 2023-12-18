const mongoose = require("mongoose");
const { Schema, model } = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductImage:
 *       type: object
 *       properties:
 *         product_id:
 *           type: string
 *           format: ObjectId
 *           description: The ID of the product associated with the image.
 *         image_url:
 *           type: string
 *           description: The URL of the image.
 *         is_primary:
 *           type: boolean
 *           default: false
 *           description: Indicates whether the image is the primary image for the product.
 *         created_by:
 *           type: string
 *           description: The username of the creator.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the image was created.
 *         updated_by:
 *           type: string
 *           description: The username of the last updater.
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the image was last updated.
 */

const ProductImageSchema = new Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  image_url: { type: String, required: true },
  is_primary: { type: Boolean, default: false },
  created_by: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_by: { type: String },
  updated_at: { type: Date },
});

const ProductImageModel = model("ProductImage", ProductImageSchema);

module.exports = ProductImageModel;
