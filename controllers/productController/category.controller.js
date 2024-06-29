import Category from "../../models/productModel/category.model.js";
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
      `category_image-${Date.now()}-${file.originalname}`,
  },
});

const upload = multer({ storage: storage });

export const createCategory = async (req, res) => {
  upload.single("category_image")(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error uploading image", details: err.message });
    }

    try {
      const { category_name, category_description } = req.body;
      if (!category_name) {
        return res.status(400).json({ error: "Category name is required" });
      }

      const category_image = req.file ? req.file.path : null;

      const category = await Category.create({
        category_name,
        category_image,
        category_description,
      });
      res.status(201).json(category);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while creating the category" });
    }
  });
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the categories" });
  }
};
