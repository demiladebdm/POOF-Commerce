const express = require("express");
const BillingModel = require("../models/Billing/Billing");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Billing
 *   description: API endpoints for managing billing address
 *
 * /api/v1/billing-address:
 *
 *   get:
 *     summary: Retrieve billing address
 *     tags: [Billing]
 *     responses:
 *       200:
 *         description: Billing address
 *
 * 
 * /api/v1/billing-address/{id}:
 *   put:
 *     summary: Update a billing address
 *     tags: [Billing]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the billing address to delete
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Billing'
 *     responses:
 *       201:
 *         description: Billing address updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Billing Address not found
 */

router.get("/", async (req, res, next) => {
  try {
    const billing = await BillingModel.find().sort({
      created_at: -1,
    });
    // console.log("billing", billing);
    res
      .status(200)
      .json({
        success: true,
        responseData: billing,
        responseMessage: "Successful",
        responseCode: "00"
      });
  } catch (error) {
    console.error("Error fetching billing address", error);
    res
      .status(500)
      .send({
        success: false,
        error: "Internal Server Error",
        responseMessage: "Failed",
        responseCode: "99"
      });
  }
});

module.exports = router;
