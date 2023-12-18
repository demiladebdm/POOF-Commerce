const express = require("express");
const OrderModel = require("../models/Order/Order");
const mongoose = require("mongoose");
const { UserModel } = require("../models/User/User");
const OrderItemModel = require("../models/Order/OrderItem");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API endpoints for managing orders
 *
 * /api/v1/orders:
 *
 *   get:
 *     summary: Retrieve a list of orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: A list of orders
 *
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid input
 *
 *
 * /api/v1/orders/{user_id}:
 *
 *   get:
 *     summary: Retrieve all User Orders
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the User
 *     responses:
 *       200:
 *         description: A list of user orders
 *       404:
 *         description: Order not found
 *
 *
 * /api/v1/orders/total-sales:
 *
 *   get:
 *     summary: Retrieve the total sales
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Total Sales
 *
 *
 * /api/v1/orders/get-count:
 *
 *   get:
 *     summary: Retrieve the total order count
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Total Order Count
 *
 *
 * /api/v1/orders/{id}:
 *
 *   get:
 *     summary: Retrieve a order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the order to update
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Order not found
 *
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the order to delete
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal Server Error
 *
 *
 * /api/v1/orders/cancel/{id}:
 *
 *   delete:
 *     summary: Cancel an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the order to cancel
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal Server Error
 *
 *
 * /api/v1/orders/update-order-status/{id}:
 *   put:
 *     summary: Update an Order status
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the order to update
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_status:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Order not found
 */

//Retrieve all Orders
router.get("/", async (req, res, next) => {
  try {
    const orderCount = await OrderModel.countDocuments();
    const orders = await OrderModel.find()
      .populate({
        path: "order_item",
        populate: { path: "product_id", populate: "category_id" },
      })
      .populate({
        path: "user_id",
        populate: "address",
      })
      .sort({ created_at: -1 });
    // console.log("orders", orders);

    res.status(200).json({
      success: true,
      responseDate: orders,
      total: orderCount,
      responseMessage: "Successful",
      responseCode: "00",
    });
  } catch (error) {
    console.error("Error fetching orders", error);
    res.status(500).send({
      success: false,
      error: "Internal Server Error",
      responseMessage: "Failed",
      responseCode: "99",
    });
  }
});

//Retrieve Total Sales
router.get("/total-sales", async (req, res, next) => {
  try {
    const totalSales = await OrderModel.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$total_amount" } } },
    ]);

    if (!totalSales) {
      return res.status(400).json({
        success: false,
        error: "Total Order Sales cannot be generated",
      });
    }
    // console.log("userCount", userCount);

    const totalSalesAmount = totalSales.pop().totalSales;

    res.status(200).json({
      success: true,
      responseData: totalSalesAmount,
      responseMessage: "Successful",
      responseCode: "00",
    });
  } catch (error) {
    console.error("Error fetching Total Order Sales", error);
    res.status(500).send({
      success: false,
      error: "Internal Server Error",
      responseMessage: "Failed",
      responseCode: "99",
    });
  }
});

//Retrieve all User Orders
router.get("/:user_id", async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const userOrderCount = await OrderModel.countDocuments({user_id: user_id});

    // Check if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid user order ID format" });
    }

    const userOrderList = await OrderModel.find({ user_id })
      .populate({
        path: "order_item",
        populate: { path: "product_id", populate: "category_id" },
      })
      // .populate({
      //   path: "user_id",
      //   populate: "address",
      // })
      .sort({ created_at: -1 });

    if (!userOrderList) {
      return res.status(400).json({
        success: false,
        // error: "Invalid OrderItem IDs in the order_item array",
      });
    }

    res.status(200).json({
      success: true,
      responseDate: userOrderList,
      total: userOrderCount,
      responseMessage: "Successful",
      responseCode: "00",
    });
  } catch (error) {
    console.error("Error fetching orders", error);
    res.status(500).send({
      success: false,
      error: "Internal Server Error",
      responseMessage: "Failed",
      responseCode: "99",
    });
  }
});

// Create an order
router.post("/", async (req, res, next) => {
  try {
    const { user_id, order_item, created_by } = req.body;

    // Validate required fields
    if (!user_id || !order_item || !created_by) {
      return res.status(400).json({
        success: false,
        error: "user_id, total_amount, order_item and created_by are required",
      });
    }

    // Ensure order_item contains valid OrderItem IDs
    const isValidOrderItemIDs = order_item.every((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (!isValidOrderItemIDs) {
      return res.status(400).json({
        success: false,
        error: "Invalid OrderItem IDs in the order_item array",
      });
    }

    // Fetch OrderItem documents based on the provided IDs
    const orderItems = await OrderItemModel.find({ _id: { $in: order_item } });

    // Calculate the total amount by summing the total_price values
    const total_amount = orderItems.reduce(
      (total, item) => total + item.total_price,
      0
    );

    const newOrder = new OrderModel({
      user_id,
      total_amount,
      order_item,
      created_by,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: savedOrder,
      responseMessage: "Successful",
      responseCode: "00",
    });
  } catch (error) {
    console.error("Error creating order", error);
    res.status(500).send({
      success: false,
      error: "Internal Server Error",
      responseMessage: "Failed",
      responseCode: "99",
    });
  }
});


//Retrieve Order count
router.get("/get-count", async (req, res, next) => {
  try {
    const orderCount = await OrderModel.countDocuments();
    // console.log("orderCount", orderCount);

    res.status(200).json({
      success: true,
      responseData: orderCount,
      responseMessage: "Successful",
      responseCode: "00",
    });
  } catch (error) {
    console.error("Error fetching order count", error);
    res.status(500).send({
      success: false,
      error: "Internal Server Error",
      responseMessage: "Failed",
      responseCode: "99",
    });
  }
});

//Retrieve an Order by Id
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid order ID format" });
    }

    const order = await OrderModel.findById(id)
      .populate("order_item user_id")
      .sort({ created_at: -1 });
    // console.log("orders", orders);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Transform the orders array to replace null with an empty object in the order_item field
    const transformedOrder = {
      ...order.toObject(),
      user: order.user_id || {}, // Replace null with an empty object
      order_item: order.order_item || {}, // Replace null with an empty object
    };
    res.status(200).json({
      success: true,
      responseDate: transformedOrder,
      responseMessage: "Successful",
      responseCode: "00",
    });
  } catch (error) {
    console.error("Error fetching orders", error);
    res.status(500).send({
      success: false,
      error: "Internal Server Error",
      responseMessage: "Failed",
      responseCode: "99",
    });
  }
});

//Update a order status by ID
router.put("/update-order-status/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { order_status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid order ID format" });
    }

    const existingOrder = await OrderModel.findById(id);

    if (!existingOrder) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    // Set the order_status and updated_at field to the current date
    existingOrder.order_status = order_status;
    existingOrder.updated_at = new Date();

    const updatedOrder = await existingOrder.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
      responseMessage: "Successful",
      responseCode: "00",
    });
  } catch (error) {
    console.error("Error updating order status", error);
    res.status(500).send({
      success: false,
      error: "Internal Server Error",
      responseMessage: "Failed",
      responseCode: "99",
    });
  }
});

//Deleting an Order
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid order ID format" });
    }

    // Find the order to get the associated order_item IDs
    const order = await OrderModel.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    // Extract order_item IDs from the order
    const orderItemIds = order.order_item.map((orderItem) => orderItem._id);

    // Delete the order and its associated order_items
    const orderResult = await OrderModel.deleteOne({ _id: id });
    const orderItemsResult = await OrderItemModel.deleteMany({
      _id: { $in: orderItemIds },
    });

    if (orderResult.deletedCount === 0) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order and associated OrderItems deleted successfully",
      responseMessage: "Successful",
      responseCode: "00",
    });
  } catch (error) {
    console.error("Error deleting order and associated OrderItems", error);
    res.status(500).send({
      success: false,
      error: "Internal Server Error",
      responseMessage: "Failed",
      responseCode: "99",
    });
  }
});

module.exports = router;
