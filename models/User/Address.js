const mongoose = require("mongoose");
const BillingModel = require("../Billing/Billing");
const { Schema, model } = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
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
 *         is_default:
 *           type: boolean
 *           default: false
 *           description: Indicates whether this is the default shipping address.
 */

const AddressSchema = new Schema({
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
  is_default: { type: Boolean, default: false },
});


// Pre-save hook to update Billing if is_default is set to true
AddressSchema.pre("save", async function (next) {
  if (this.isModified("is_default") && this.is_default) {
    try {
      // Find and update the corresponding Billing document
      const billing = await BillingModel.findOne({ user_id: this.user_id });
      if (billing) {
        billing.street_address = this.street_address;
        billing.city = this.city;
        billing.state = this.state;
        billing.postal_code = this.postal_code;
        billing.country = this.country;
        await billing.save();
      }
    } catch (error) {
      return next(error);
    }
  }
  return next();
});



const AddressModel = model("Address", AddressSchema);

module.exports = AddressModel;