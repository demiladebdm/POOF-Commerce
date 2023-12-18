const mongoose = require("mongoose");
const { Schema, model } = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         user_id:
 *           type: string
 *           format: ObjectId
 *           description: The ID of the user who placed the order.
 *         order_item:
 *           type: array
 *           items: 
 *             type: string
 *           description: Array of Order Items IDs
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

const OrderSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  total_amount: { type: Number },
  order_status: { type: String, default: "Pending" },
  shipping_address: { type: String },
  payment_status: { type: String, default: "Not Paid" },
  order_item: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }],
  created_by: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_by: { type: String },
  updated_at: { type: Date },
});

const OrderModel = model("Order", OrderSchema);

module.exports = OrderModel;
