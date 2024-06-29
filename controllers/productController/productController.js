import Product from "../../models/productModel/product.model.js";
import User from "../../models/userModel/user.model.js";
import Subcategory from "../../models/productModel/subcategory.model.js";
import Category from "../../models/productModel/category.model.js";
import { Op } from "sequelize";

import pkg from "cloudinary";
const { v2: cloudinary } = pkg;
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { config } from "dotenv";

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    format: async (req, file) => "png",
    public_id: (req, file) =>
      `productImages-${Date.now()}-${file.originalname}`,
  },
});

const upload = multer({ storage: storage }).array("productImages", 5);

export const createProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({ error: "Multer error: " + err.message });
    } else if (err) {
      // An unknown error occurred
      return res.status(500).json({ error: "Unknown error: " + err.message });
    }

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

    const uploadedImages = req.files.map((file) => file.path);

    try {
      const product = await Product.create({
        name,
        description,
        price,
        sku,
        stock_level,
        subcategory_id,
        created_by,
        image_url: uploadedImages,
      });

      res.status(201).json({
        message: "Product created successfully",
        status: 201,
        data: product,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error creating product: " + error.message });
    }
  });
};

export const updateProductById = async (req, res) => {
  try {
    const uploadMultiple = upload.array("images", 5); // Handle up to 5 images

    uploadMultiple(req, res, async (err) => {
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

        let imageUrls = product.image_urls || []; // Existing image URLs

        if (req.files && req.files.length > 0) {
          for (const file of req.files) {
            const imageUrl = file.path; // Adjust path as per your file storage logic
            imageUrls.push(imageUrl);
          }
        }

        product.image_urls = imageUrls;

        await product.save();
        res.status(200).json({
          message: "Product updated successfully",
          status: 200,
          data: {
            ...product.toJSON(),
            image_url: uploadedImages,
          },
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
    const products = await Product.findAll();

    const formattedProducts = products.map((product) => {
      const imageUrls =
        typeof product.image_url === "string"
          ? JSON.parse(product.image_url)
          : product.image_url;

      return {
        ...product.toJSON(),
        image_url: imageUrls,
      };
    });

    res.status(200).json({
      message: "Products retrieved successfully",
      status: 200,
      data: formattedProducts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    const imageUrls =
      typeof product.image_url === "string"
        ? JSON.parse(product.image_url)
        : product.image_url;
    if (product) {
      res.status(200).json({
        message: "Product retrieved successfully",
        status: 200,
        data: {
          ...product.toJSON(),
          image_url: imageUrls,
        },
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

export const searchProducts = async (req, res) => {
  try {
    const { query, page = 1, limit = 8 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = query
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${query}%` } },
            { description: { [Op.like]: `%${query}%` } },
          ],
        }
      : {};

    const { count, rows } = await Product.findAndCountAll({
      where: whereClause,
      offset,
      limit: parseInt(limit),
    });

    const formattedProducts = rows.map((product) => {
      const imageUrls =
        typeof product.image_url === "string"
          ? JSON.parse(product.image_url)
          : product.image_url;

      return {
        ...product.toJSON(),
        image_url: imageUrls,
      };
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      message: "Products retrieved successfully",
      status: 200,
      data: formattedProducts,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
