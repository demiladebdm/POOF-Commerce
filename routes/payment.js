const express = require("express");
const PaymentModel = require("../models/Payment/Payment");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: API endpoints for managing payments
 *
 * /api/v1/payments:
 *
 *   get:
 *     summary: Retrieve a list of payments
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: A list of payments
 *
 *   post:
 *     summary: Create a new payments
 *     tags: [Payments]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       400:
 *         description: Invalid input
 * 
 * /api/v1/payments/cancel/{id}:
 * 
 *   delete:
 *     summary: Cancel a payment by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the payment to cancel
 *     responses:
 *       200:
 *         description: Payment cancelled successfully
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal Server Error
 */

router.get("/", async (req, res, next) => {
  try {
    const payments = await PaymentModel.find().sort({ created_at: -1 });
    // console.log("payments", payments);
    res
      .status(200)
      .json({
        success: true,
        responseData: payments,
        responseMessage: "Successful",
        responseCode: "00",
      });
  } catch (error) {
    console.error("Error fetching orders", error);
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
