const express = require("express");
const CartItemModel = require("../models/Cart/CartItem");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CartItems
 *   description: API endpoints for managing Cart Items
 *
 * /api/v1/cart-items:
 *
 *   get:
 *     summary: Retrieve a list of Cart Items
 *     tags: [CartItems]
 *     responses:
 *       200:
 *         description: A list of Cart Items
 *
 *   post:
 *     summary: Create a new cart item
 *     tags: [CartItems]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItem'
 *     responses:
 *       201:
 *         description: Cart Item created successfully
 *       400:
 *         description: Invalid input
 * 
 * /api/v1/cart-items/remove/{id}:
 * 
 *   delete:
 *     summary: Remove an item by ID from cart
 *     tags: [CartItems]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the item in cart to remove
 *     responses:
 *       200:
 *         description: Item in cart removed successfully
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal Server Error
 */

router.get("/", async (req, res, next) => {
  try {
    const cartItems = await CartItemModel.find().sort({ created_at: -1 });
    // console.log("cartItems", cartItems);
    res
      .status(200)
      .json({
        success: true,
        responseData: cartItems,
        responseMessage: "Successful",
        responseCode: "00",
      });
  } catch (error) {
    console.error("Error fetching Cart Items", error);
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
