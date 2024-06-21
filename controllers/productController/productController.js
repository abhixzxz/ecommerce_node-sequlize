import Product from "../../models/productModel/product.model.js";
import User from "../../models/userModel/user.model.js";
import Subcategory from "../../models/productModel/subcategory.model.js";
import Category from "../../models/productModel/category.model.js";
import { upload } from "../../config/cloudinary.config.js";

export const createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    sku,
    stock_level,
    subcategory_id,
    created_by,
  } = req.body;

  if (!name || !price || !sku || !subcategory_id || !created_by) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const imageUrl = req.file ? req.file.path : null;

  try {
    const product = await Product.create({
      name,
      description,
      price,
      sku,
      stock_level,
      subcategory_id,
      created_by,
      image_url: imageUrl,
    });

    res.status(201).json({
      message: "Product created successfully",
      status: 201,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProductById = async (req, res) => {
  try {
    const uploadSingle = upload.single("image");

    uploadSingle(req, res, async (err) => {
      if (err) return res.status(400).json({ error: err.message });

      const { name, description, price, sku, stock_level, subcategory_id } =
        req.body;
      const product = await Product.findByPk(req.params.id);
      if (product) {
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.sku = sku || product.sku;
        product.stock_level = stock_level || product.stock_level;
        product.subcategory_id = subcategory_id || product.subcategory_id;

        if (req.file) {
          product.image_url = req.file.path;
        }

        await product.save();
        res.status(200).json({
          message: "Product updated successfully",
          status: 200,
          data: product,
        });
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Subcategory,
          include: [Category],
        },
        {
          model: User,
        },
      ],
    });
    res.status(200).json({
      message: "Products retrieved successfully",
      status: 200,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Subcategory,
          include: [Category],
        },
        {
          model: User,
        },
      ],
    });
    if (product) {
      res.status(200).json({
        message: "Product retrieved successfully",
        status: 200,
        data: product,
      });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.destroy();
      res.status(200).json({
        message: "Product deleted successfully",
        status: 200,
      });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
