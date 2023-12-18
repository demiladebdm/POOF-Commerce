const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const AddressModel = require("./Address");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user.
 *         email:
 *           type: string
 *           description: The email of the user.
 *         password_hash:
 *           type: string
 *           description: The hashed password of the user.
 *         first_name:
 *           type: string
 *           description: The first name of the user.
 *         last_name:
 *           type: string
 *           description: The last name of the user.
 *         sex:
 *           type: string
 *           enum:
 *              - male
 *              - female
 *              - others
 *           description: The gender of the user.
 *         role:
 *           type: string
 *           enum:
 *              - admin
 *              - seller
 *              - user
 *           description: The role of the user.
 *         is_verified:
 *           type: boolean
 *           default: false
 *           description: Indicates whether the user's email is verified.
 *         profile_photo:
 *           type: string
 *           description: The profile_photo of the user.
 *         phone_number:
 *           type: string
 *           description: The phone number of the user.
 *         wishlist:
 *           type: array
 *           items:
 *              type: string
 *           description: Array of product IDs in the user's wishlist.
 *         orders:
 *           type: array
 *           items:
 *              type: string
 *           description: Array of order IDs in the user's order history.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the user was created.
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the user was last updated.
 * 
 * 
 *     UserRegistration:
 *       type: object
 *       properties:
 *         username:
 *           $ref: '#/components/schemas/User/properties/username'
 *         email:
 *           $ref: '#/components/schemas/User/properties/email'
 *         password:
 *           type: string
 *           description: The password for user registration.
 *         first_name:
 *           $ref: '#/components/schemas/User/properties/first_name'
 *         last_name:
 *           $ref: '#/components/schemas/User/properties/last_name'
 *         sex:
 *           $ref: '#/components/schemas/User/properties/sex'
 *         phone_number:
 *           $ref: '#/components/schemas/User/properties/phone_number'
 * 
 * 
 *     UserLogin:
 *       type: object
 *       properties:
 *         email:
 *           $ref: '#/components/schemas/User/properties/email'
 *         password:
 *           type: string
 *           description: The password for user login.
 */

// User Schema (common fields)
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  address: { type: Schema.Types.ObjectId, ref: "Address" },
  sex: { type: String, enum: ["male", "female", "others"], required: true },
  role: { type: String, default: "user" },
  is_verified: { type: String, default: false },
  profile_photo: { type: String },
  phone_number: { type: String },
  wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// User Registration Schema
const UserRegistrationSchema = new Schema({
  username: UserSchema.path("username"),
  email: UserSchema.path("email"),
  password: { type: String, required: true },
  first_name: UserSchema.path("first_name"),
  last_name: UserSchema.path("last_name"),
  sex: UserSchema.path("sex"),
  phone_number: UserSchema.path("phone_number"),
});

// User Login Schema
const UserLoginSchema = new Schema({
  email: UserSchema.path("email"),
  password: { type: String, required: true },
});

const UserModel = model("User", UserSchema);

module.exports = {
  UserModel,
  UserRegistrationSchema,
  UserLoginSchema,
};
