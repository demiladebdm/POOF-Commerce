const mongoose = require("mongoose");
const { Schema, model } = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         cart_item_id:
 *           type: string
 *           format: ObjectId
 *           description: The ID of the order items.
 *         cart_id:
 *           type: string
 *           format: ObjectId
 *           description: The ID of the order.
 *         product_id:
 *           type: string
 *           format: ObjectId
 *           description: The ID of the product being reviewed.
 *         quantity:
 *           type: number
 *           description: The quantity of items.
 *         created_by:
 *           type: string
 *           description: The username of the creator.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the order item was created.
 *         updated_by:
 *           type: string
 *           description: The username of the last updater.
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the order item was last updated.
 */

const CartItemSchema = new Schema({
  cart_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number },
  created_by: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_by: { type: String },
  updated_at: { type: Date, default: Date.now },
});

const CartItemModel = model("CartItem", CartItemSchema);

module.exports = CartItemModel;
