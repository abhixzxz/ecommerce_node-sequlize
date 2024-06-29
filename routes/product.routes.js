import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  searchProducts,
} from "../controllers/productController/productController.js";
import {
  createCategory,
  getAllCategories,
} from "../controllers/productController/category.controller.js";

import {
  createSubcategory,
  getAllSubcategories,
} from "../controllers/productController/subcategory.controller.js";
import { upload } from "../config/cloudinary.config.js";

const router = express.Router();

router.post("/create-product", createProduct);

router.get("/get-all-products", getAllProducts);
router.get("/getProductById/:id", getProductById);
router.put("/update-product-by-id/:id", updateProductById);
router.delete("/delete-product-by-id/:id", deleteProductById);

// search product

router.get("/search-products", searchProducts);

// category

router.post("/create-category", createCategory);
router.get("/getAllCategory", getAllCategories);

// sub category
router.post("/create-subcategory", createSubcategory);
router.get("/create-subcategory", getAllSubcategories);

export default router;
