const mongoose = require("mongoose");
const { Schema, model } = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the category.
 *         description:
 *           type: string
 *           description: The description of the category.
 *         parent_category_id:
 *           type: string
 *           format: ObjectId
 *           description: The parent category ID of the category.
 *         created_by:
 *           type: string
 *           description: The username of the creator.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the category was created.
 *         updated_by:
 *           type: string
 *           description: The username of the last updater.
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the category was last updated.
 */

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  parent_category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  created_by: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_by: { type: String },
  updated_at: { type: Date },
});

const CategoryModel = model("Category", CategorySchema);

module.exports = CategoryModel;
