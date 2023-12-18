const mongoose = require("mongoose");
const { Schema, model } = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
 *     Billing:
 *       type: object
 *       properties:
 *         user_id:
 *           type: string
 *           description: The ID of the user associated with the address.
 *         street_address:
 *           type: string
 *           description: The street address.
 *         city:
 *           type: string
 *           description: The city.
 *         state:
 *           type: string
 *           description: The state.
 *         postal_code:
 *           type: string
 *           description: The postal code.
 *         country:
 *           type: string
 *           description: The country.
 */

const BillingSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  street_address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String },
  postal_code: { type: String, required: true },
  country: { type: String, required: true },
});

const BillingModel = model("Billing", BillingSchema);

module.exports = BillingModel;
