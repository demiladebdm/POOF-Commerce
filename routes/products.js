const express = require("express");
const ProductModel = require("../models/Product/Product");
const CategoryModel = require("../models/Product/Category");
const { default: mongoose } = require("mongoose");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API endpoints for managing products
 *
 * /api/v1/products:
 *
 *   get:
 *     summary: Retrieve a list of products by categories
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: categories
 *         schema:
 *           type: string
 *         style: form
 *         explode: false
 *         description: Comma-separated list of category IDs to filter the products
 *     responses:
 *       200:
 *         description: A list of products
 *
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input
 *
 *
 * /api/v1/products/featured-products/{count}:
 *
 *   get:
 *     summary: Retrieve a list of featured products
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: count
 *         schema:
 *           type: number
 *         description: The number of the products to retrieve
 *     responses:
 *       200:
 *         description: A list of featured products
 *
 *
 * /api/v1/products/selected-properties:
 *
 *   get:
 *     summary: Retrieve a list of products with selected properties
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 *
 *
 * /api/v1/products/{id}:
 *
 *   get:
 *     summary: Retrieve a products by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to retrieve
 *     responses:
 *       200:
 *         description: A list of products
 *       404:
 *         description: Product not found
 *
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to update
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 *
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 *
 *
 * /api/v1/products/get-count:
 *
 *   get:
 *     summary: Get the total products count
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A Count of products
 *
 */

//Retrieve Products by categories
router.get("/", async (req, res, next) => {
  try {
    let filter = {};

    if (req.query.categories) {
      filter = { category_id: { $in: req.query.categories.split(",") } };
    }

    const products = await ProductModel.find(filter)
      .populate("category_id product_image product_video")
      // .select(" _id ")
      .sort({ created_at: -1 });
    const productCount = await ProductModel.countDocuments(filter);
    // console.log("products", products);

    // Transform the products array to replace null with an empty object in the respective fields
    const transformedProducts = products.map((product) => {
      const transformedProduct = { ...product.toObject() };

      // Replace null with an empty object
      transformedProduct.category_id = product.category_id || {};
      transformedProduct.product_image = product.product_image || {};
      transformedProduct.product_video = product.product_video || {};

      return transformedProduct;
    });

    res.status(200).json({
      success: true,
      responseData: transformedProducts,
      total: productCount,
      responseMessage: "Successful",
      responseCode: "00",
    });
  } catch (error) {
    console.error("Error fetching products", error);
    res.status(500).send({
      success: false,
      error: "Internal Server Error",
      responseMessage: "Failed",
      responseCode: "99",
    });
  }
});

//Retrieve Featured Products
router.get("/featured-products/:count", async (req, res, next) => {
  try {
    const { count = 0 } = req.params;

    const featuredProducts = await ProductModel.find({ is_featured: true })
      .populate("product_image product_video")
      .limit(+count)
      .sort({ created_at: -1 });
    const featuredProductCount = await ProductModel.countDocuments({
      is_featured: true,
    });
    // console.log("products", products);

    // Transform the products array to replace null with an empty object in the respective fields
    const transformedProducts = featuredProducts.map((featuredProducts) => {
      return {
        ...featuredProducts.toObject(),
        product_image: featuredProducts.product_image || {}, // Replace null with an empty object
        product_video: featuredProducts.product_video || {}, // Replace null with an empty object
      };
    });

    res.status(200).json({
      success: true,
      responseData: transformedProducts,
      total: featuredProductCount,
      responseMessage: "Successful",
      responseCode: "00",
    });
  } catch (error) {
    console.error("Error fetching featured products", error);
    res.status(500).send({
      success: false,
      error: "Internal Server Error",
      responseMessage: "Failed",
      responseCode: "99",
    });
  }
});

//Retrieve all Products with selected properties
router.get("/selected-properties", async (req, res, next) => {
  try {
    const products = await ProductModel.find()
      .select("name description brand price stock_quantity is_featured _id")
      .sort({ created_at: -1 });
    const productCount = await ProductModel.countDocuments();
    // console.log("selected-products", products);

    res.status(200).json({
      success: true,
      responseData: products,
      total: productCount,
      responseMessage: "Successful",
      responseCode: "00",
    });
  } catch (error) {
    console.error("Error fetching products", error);
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

//Retrieve Products count
router.get("/get-count", async (req, res, next) => {
  try {
    const productCount = await ProductModel.countDocuments();
    // console.log("productCount", productCount);

    res.status(200).json({
      success: true,
      responseData: productCount,
      responseMessage: "Successful",
      responseCode: "00",
    });
  } catch (error) {
    console.error("Error fetching products count", error);
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

//Create a Product
router.post("/", async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      stock_quantity,
      brand,
      is_featured,
      category_id,
      created_by,
    } = req.body;

    const newProduct = new ProductModel({
      name,
      description,
      price,
      stock_quantity,
      brand,
      is_featured,
      category_id,
      created_by,
      updated_by: created_by,
    });

    // Check if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(category_id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid category ID format" });
    }

    const existingCategory = await CategoryModel.findById(category_id);

    if (!existingCategory) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }

    const savedProduct = await newProduct.save();
    // console.log("new", newProduct)
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: savedProduct,
      responseMessage: "Successful",
      responseCode: "00",
    });
  } catch (error) {
    console.error("Error creating product", error);
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

//Retrieve a Product by ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid product ID format" });
    }

    // Find the user by ID and populate the address field
    const product = await ProductModel.findById(id)
      .populate("product_image product_video")
      .sort({ created_at: -1 });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    // Transform the product object to replace null with an empty object in the respective fields
    const transformedProduct = {
      ...product.toObject(),
      address: product.address || {}, // Replace null with an empty object
    };

    res.status(200).json({
      success: true,
      responseData: transformedProduct,
      responseMessage: "Successful",
      responseCode: "00",
    });
  } catch (error) {
    console.error("Error fetching product by ID", error);
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

//Update a product by ID
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category_id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(category_id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid category ID format" });
    }

    const existingCategory = await CategoryModel.findById(category_id);

    if (!existingCategory) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }

    const existingProduct = await ProductModel.findById(id);

    // Update only the fields that are provided in the request body
    Object.assign(existingProduct, req.body);

    // Set the updated_at field to the current date
    existingProduct.updated_at = new Date();

    const updatedProduct = await existingProduct.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
      responseMessage: "Successful",
      responseCode: "00",
    });
  } catch (error) {
    console.error("Error updating product", error);
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
