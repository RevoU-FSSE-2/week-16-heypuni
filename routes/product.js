const { Router } = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/bookController");
const authentication = require("../middleware/authentication");
const { updateProduct, createProduct, deleteProduct } = require("../controllers/products");

const productRoute = Router();

productRoute.get("/", authentication, getAllProducts);
productRoute.post('/', authentication, createProduct);
productRoute.put('/:id', authentication, updateProduct);
productRoute.delete('/:id', authentication, deleteProduct);

module.exports = productRoute;