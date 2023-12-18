const mongoose = require("mongoose");
const { Schema, model } = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the product.
 *         description:
 *           type: string
 *           description: The description of the product.
 *         price:
 *           type: number
 *           description: The price of the product.
 *         stock_quantity:
 *           type: number
 *           description: The stock quantity of the product.
 *         brand:
 *           type: string
 *           description: The brand of the product.
 *         is_featured:
 *           type: boolean
 *           default: false
 *           description: To feature the product on the Homepage.
 *         category_id:
 *           type: string
 *           format: ObjectId
 *           description: The category ID of the product.
 *         product_image:
 *           type: string
 *           format: ObjectId
 *           description: The ID of the associated product image.
 *         product_video:
 *           type: string
 *           format: ObjectId
 *           description: The ID of the associated product image.
 *         variants:
 *           type: array
 *           items:
 *              type: string
 *           description: Array of product variants.
 *         attributes:
 *           type: object
 *           additionalProperties:
 *              type: string
 *           description: Map of additional product attributes.
 *         weight:
 *           type: number
 *           description: The weight of the productt.
 *         dimensions:
 *           type: object
 *           properties:
 *              length:
 *                 type: number
 *              width:
 *                 type: number
 *              height:
 *                 type: number
 *           description: Dimensions of the product.
 *         shipping_class:
 *           type: string
 *           description: Shipping class of the product.
 *         upsells:
 *           type: array
 *           items:
 *              type: string
 *           description: IDs of upsell products.
 *         cross_sells:
 *           type: array
 *           items:
 *              type: string
 *           description: IDs of cross-sell products.
 *         compatibility:
 *           type: string
 *           description: Compatibility information.
 *         warranty_duration:
 *           type: string
 *           description: Duration of the product warranty.
 *         warranty_description:
 *           type: string
 *           description: Description of the product warranty.
 *         faq:
 *           type: string
 *           description: Frequently Asked Questions.
 *         user_manual:
 *           type: string
 *           description: URL or content of the user manual.
 *         meta_title:
 *           type: string
 *           description: Meta title for SEO.
 *         meta_description:
 *           type: string
 *           description: Meta description for SEO.
 *         seo_url:
 *           type: string
 *           description: SEO-friendly URL for the product.
 *         created_by:
 *           type: string
 *           description: The username of the creator.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the product was created.
 *         updated_by:
 *           type: string
 *           description: The username of the last updater.
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the product was last updated.
 */

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock_quantity: { type: Number, min: 0, required: true },
  brand: { type: String, required: true },
  is_featured: { type: Boolean, default: false },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  product_image: { type: Schema.Types.ObjectId, ref: "ProductImage" },
  product_video: { type: Schema.Types.ObjectId, ref: "ProductVideo" },
  variants: [{ type: String }],
  attributes: { type: Map, of: String },
  weight: { type: Number },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
  },
  shipping_class: { type: String },
  upsells: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  cross_sells: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  compatibility: { type: String },
  warranty_duration: { type: String },
  warranty_description: { type: String },
  faq: { type: String },
  user_manual: { type: String },
  meta_title: { type: String },
  meta_description: { type: String },
  seo_url: { type: String },
  created_by: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_by: { type: String, required: true },
  updated_at: { type: Date, default: Date.now },
});


ProductSchema.virtual("id").get(function () {
  console.log("Virtual property id triggered");
  return this._id.toHexString();
})

ProductSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    console.log("Transforming toJSON");
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const ProductModel = model("Product", ProductSchema);

module.exports = ProductModel;
