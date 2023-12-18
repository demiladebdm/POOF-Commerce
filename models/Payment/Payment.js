const mongoose = require("mongoose");
const { Schema, model } = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       properties:
 *         order_id:
 *           type: string
 *           format: ObjectId
 *           description: The ID of the order for which the payment is made.
 *         payment_method:
 *           type: string
 *           description: The payment method used.
 *         transaction_id:
 *           type: string
 *           description: The transaction ID for the payment.
 *         amount:
 *           type: string
 *           description: The amount of the payment.
 *         payment_status:
 *           type: string
 *           description: The status of the payment.
 *         payment_date:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the payment was made.
 */

const PaymentSchema = new Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  payment_method: { type: String },
  transaction_id: { type: String, required: true },
  amount: { type: String },
  payment_status: { type: String },
  payment_date: { type: Date, default: Date.now },
});

const PaymentModel = model("Payment", PaymentSchema);

module.exports = PaymentModel;
