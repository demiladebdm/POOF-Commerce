// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./swaggerOptions");

const specs = swaggerJsdoc(swaggerOptions);

// console.log("Swagger specs:", specs);

module.exports = {
  swaggerUi,
  specs,
};
