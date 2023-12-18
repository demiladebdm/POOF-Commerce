const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
var fs = require("fs");
var rfs = require("rotating-file-stream");
var path = require("path");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const os = require("os");
// const authJwt = require("./middlewares/jwt");
// const errorHandler = require("./middlewares/errorHandler");
const { swaggerUi, specs } = require("./swagger");

const { invalidPathHandler } = require("./middlewares/errorHandler");

const app = express();
dotenv.config();
const PORT = process.env.PORT || 6000;
const API = process.env.API_URL;

console.log("os", os.cpus().length);
//Database Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

//Swagger Docs Setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

//Cors Resolve
app.use(cors());
app.options("*", cors());

//Middlewares
app.use(bodyParser.json());

// create a write stream (in append mode) and setup the logger
// var logDirectory = path.join(__dirname, "log");
var logDirectory = path.join("/tmp", "log");
var ecommerceLogStream = rfs.createStream("ecommerce.log", {
  interval: "1d",
  path: logDirectory,
});
app.use(morgan("combined", { stream: ecommerceLogStream }));

// app.use(authJwt);
// app,use(errorHandler);

// Add this to your index.js or wherever your routes are defined
app.get("/swagger/v1/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(specs);
});

//Routes
const authRoute = require("./routes/auth");
const productRoute = require("./routes/products");
const categoryRoute = require("./routes/categories");
const productImageRoute = require("./routes/productImages");
const productVideoRoute = require("./routes/productVideos");
const userRoute = require("./routes/users");
const addressRoute = require("./routes/address");
const orderRoute = require("./routes/orders");
const orderItemRoute = require("./routes/orderItems");
const paymentRoute = require("./routes/payment");
const reviewRoute = require("./routes/review");
const cartRoute = require("./routes/cart");
const cartItemRoute = require("./routes/cartItems");
const billingRoute = require("./routes/billing");

app.use(`${API}/auth`, authRoute);
app.use(`${API}/products`, productRoute);
app.use(`${API}/categories`, categoryRoute);
app.use(`${API}/product-images`, productImageRoute);
app.use(`${API}/product-videos`, productVideoRoute);
app.use(`${API}/users`, userRoute);
app.use(`${API}/address`, addressRoute);
app.use(`${API}/orders`, orderRoute);
app.use(`${API}/order-items`, orderItemRoute);
app.use(`${API}/payments`, paymentRoute);
app.use(`${API}/reviews`, reviewRoute);
app.use(`${API}/carts`, cartRoute);
app.use(`${API}/cart-items`, cartItemRoute);
app.use(`${API}/billing-address`, billingRoute);

app.use(invalidPathHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} + ${API}`);
});

// // Seeding route (add this route only in development)
// const { ObjectId } = mongoose.Types;
// const ProductModel = require("./models/Product/Product");
// if (process.env.NODE_ENV === "development") {
//   app.get("/seed-data", async (req, res) => {
//     try {
//       // Your seeding logic here
//       console.log("Seeding data...");

//       // Sample data
//       const sampleProductData = [
//         {
//           name: "Sample Product 1",
//           description: "Description for Sample Product 1",
//           price: 19.99,
//           stock_quantity: 100,
//           brand: "Sample Brand",
//           category_id: new ObjectId(),
//           created_by: "admin",
//           updated_by: "admin",
//         },
//       ];

//       // Insert sample data into the database
//       await ProductModel.insertMany(sampleProductData);

//       console.log("Sample data seeded successfully");

//       res.status(200).send("Sample data seeded successfully");
//     } catch (error) {
//       console.error("Error seeding data:", error);
//       res.status(500).send("Internal Server Error");
//     }
//   });
// }
