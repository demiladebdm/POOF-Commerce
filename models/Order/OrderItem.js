const mongoose = require("mongoose");
const { Schema, model } = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         order_id:
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
 */

const OrderItemSchema = new Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  unit_price: { type: Number },
  total_price: { type: Number },
  created_by: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const OrderItemModel = model("OrderItem", OrderItemSchema);

module.exports = OrderItemModel;
