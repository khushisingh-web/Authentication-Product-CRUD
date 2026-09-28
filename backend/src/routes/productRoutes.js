const express = require("express");
const { body, param } = require("express-validator");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const productValidation = [
  body("name").notEmpty().withMessage("Product name is required"),

  body("description").notEmpty().withMessage("Product description is required"),

  body("price").isNumeric().withMessage("Price must be a number"),

  body("stock").isNumeric().withMessage("Stock must be a number"),
];
const productIdValidation = [
  param("id").isMongoId().withMessage("Invalid product ID"),
];

router.post("/", authMiddleware, productValidation, createProduct);
router.get("/", getAllProducts);
router.get("/:id", productIdValidation, getProductById);
router.put(
  "/:id",
  authMiddleware,
  productIdValidation,
  productValidation,
  updateProduct,
);
router.delete("/:id", authMiddleware, productIdValidation, deleteProduct);
module.exports = router;
