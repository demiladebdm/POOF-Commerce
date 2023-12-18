const express = require("express");
const CartModel = require("../models/Cart/Cart");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: API endpoints for managing carts
 *
 * /api/v1/carts:
 *
 *   get:
 *     summary: Retrieve a list of carts
 *     tags: [Carts]
 *     responses:
 *       200:
 *         description: A list of carts
 *
 *   post:
 *     summary: Create a new cart
 *     tags: [Carts]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       201:
 *         description: Cart created successfully
 *       400:
 *         description: Invalid input
 */

router.get("/", async (req, res, next) => {
  try {
    const carts = await CartModel.find()
      .populate("cart_item")
      .sort({ created_at: -1 });
    // console.log("carts", carts);

    // Transform the carts array to replace null with an empty object in the cart_item field
    const transformedCarts = carts.map((cart) => {
      return {
        ...cart.toObject(),
        cart_item: cart.cart_item || {}, // Replace null with an empty object
      };
    });
    res
      .status(200)
      .json({
        success: true,
        responseData: transformedCarts,
        responseMessage: "Successful",
        responseCode: "00",
      });
  } catch (error) {
    console.error("Error fetching carts", error);
    res
      .status(500)
      .send({
        success: false,
        error: "Internal Server Error",
        responseMessage: "Failed",
        responseCode: "99",
      });
  }
});

module.exports = router;
