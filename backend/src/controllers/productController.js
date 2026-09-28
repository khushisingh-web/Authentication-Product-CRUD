const ProductModel = require("../models/productModel");
const { validationResult } = require("express-validator");

const createProduct = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const { name, description, price, stock } = req.body;

    const product = await ProductModel.create({
      name,
      description,
      price,
      stock,
    });

    return res.status(201).json({
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.log("Create product error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();

    return res.status(200).json({
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.log("Get products error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getProductById = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.log("Get product by ID error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateProduct = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const { name, description, price, stock } = req.body;

    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        stock,
      },
      { new: true },
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.log("Update product error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteProduct = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    console.log("Delete product error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
