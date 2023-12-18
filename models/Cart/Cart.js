const mongoose = require("mongoose");
const { Schema, model } = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         user_id:
 *           type: string
 *           format: ObjectId
 *           description: The ID of the user who placed the order.
 *         created_by:
 *           type: string
 *           description: The username of the creator.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the order was created.
 *         updated_by:
 *           type: string
 *           description: The username of the last updater.
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the order was last updated.
 */

const CartSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cart_item: { type: Schema.Types.ObjectId, ref: "CartItem" },
  created_by: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_by: { type: String },
  updated_at: { type: Date },
});

const CartModel = model("Cart", CartSchema);

module.exports = CartModel;
