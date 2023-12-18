const express = require("express");
const OrderItemModel = require("../models/Order/OrderItem");
const ProductModel = require("../models/Product/Product");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: OrderItems
 *   description: API endpoints for managing Order Items
 *
 * /api/v1/order-items:
 *
 *   get:
 *     summary: Retrieve a list of Order Items
 *     tags: [OrderItems]
 *     responses:
 *       200:
 *         description: A list of Order Items
 *
 *   post:
 *     summary: Create a new order item
 *     tags: [OrderItems]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderItem'
 *     responses:
 *       201:
 *         description: Order Item created successfully
 *       400:
 *         description: Invalid input
 *
 */

// Retrieve a list of Order Items
router.get("/", async (req, res, next) => {
  try {
    const orderItems = await OrderItemModel.find().sort({ created_at: -1 });
    // console.log("orderItems", orderItems);
    res.status(200).json({
      success: true,
      responseData: orderItems,
      responseMessage: "Successful",
      responseCode: "00"
    });
  } catch (error) {
    console.error("Error fetching Order Items", error);
    res.status(500).send({
      success: false,
      error: "Internal Server Error",
      responseMessage: "Failed",
      responseCode: "99"
    });
  }
});

// Create a new order item
router.post("/", async (req, res, next) => {
  try {
    const { order_id, product_id, quantity, created_by } = req.body;

    // Validate required fields
    if (!order_id || !product_id || !quantity || !created_by) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }

    // Retrieve the product details, including the price
    const product = await ProductModel.findById(product_id);

    if (!product) {
      return res.status(400).json({
        success: false,
        error: "Invalid product ID",
      });
    }

    const product_price = product.price;

    // Calculate the total price based on quantity and unit price
    const total_price = quantity * product_price;

    const newOrderItem = new OrderItemModel({
      order_id,
      product_id,
      quantity,
      unit_price: product_price,
      total_price,
      created_by,
    });

    const savedOrderItem = await newOrderItem.save();

    res.status(201).json({
      success: true,
      message: "Order Item created successfully",
      orderItem: savedOrderItem,
      responseMessage: "Successful",
      responseCode: "00",
    });
  } catch (error) {
    console.error("Error creating Order Item", error);
    res.status(500).send({
      success: false,
      error: "Internal Server Error",
      responseMessage: "Failed",
      responseCode: "99"
    });
  }
});

module.exports = router;
