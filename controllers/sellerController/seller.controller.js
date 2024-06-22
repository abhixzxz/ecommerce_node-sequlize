import bcrypt from "bcryptjs";
import defineSellerModel from "../../models/sellerModel/seller.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../auth.controller.js";
import pkg from "cloudinary";
const { v2: cloudinary } = pkg;
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { config } from "dotenv";

config();

const Seller = defineSellerModel();
const SECRET_KEY = process.env.SECRET_KEY_SUPPLIER;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    format: async () => "png",
    public_id: (req, file) => `company-logo-${Date.now()}-${file.originalname}`,
  },
});

const upload = multer({ storage: storage }).array("companyLogos", 3); // Adjust the field name and limit as needed

const createSeller = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const {
        name,
        email,
        password,
        phone_number,
        company_name,
        gst_number,
        bank_details,
      } = req.body;

      if (!name || !email || !password || !company_name || !gst_number) {
        return res.status(400).json({
          error:
            "Name, email, password, company_name, and gst_number are required",
        });
      }

      const existingSeller = await Seller.findOne({ where: { email } });
      if (existingSeller) {
        return res.status(409).json({ error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password + SECRET_KEY, 10);

      // Upload multiple company logos to Cloudinary
      const uploadedLogos = req.files.map((file) => file.path);

      const newSeller = await Seller.create({
        name,
        email,
        password: hashedPassword,
        phone_number,
        company_name,
        gst_number,
        bank_details,
        companyLogos: uploadedLogos, // Save the array of Cloudinary URLs or public IDs
      });

      const accessToken = generateAccessToken(newSeller);
      const refreshToken = generateRefreshToken(newSeller);

      res.status(201).json({
        message: "Seller created successfully",
        status: 201,
        data: newSeller,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res
          .status(400)
          .json({ error: "Something went wrong, try with unique values" });
      }
      res
        .status(500)
        .json({ error: "Could not create seller", details: error.message });
    }
  });
};

const getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findByPk(req.params.id);
    if (seller) {
      res.status(200).json({
        message: "Seller retrieved successfully",
        status: 200,
        data: seller,
      });
    } else {
      res.status(404).json({ error: "Seller not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSellerById = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const {
        name,
        email,
        password,
        phone_number,
        company_name,
        gst_number,
        bank_details,
      } = req.body;
      const seller = await Seller.findByPk(req.params.id);
      if (seller) {
        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          seller.password = hashedPassword;
        }
        seller.name = name;
        seller.email = email;
        seller.phone_number = phone_number;
        seller.company_name = company_name;
        seller.gst_number = gst_number;
        seller.bank_details = bank_details;

        // Upload updated company logos to Cloudinary
        if (req.files.length > 0) {
          const uploadedLogos = req.files.map((file) => file.path);
          seller.companyLogos = uploadedLogos; // Update the array of Cloudinary URLs or public IDs
        }

        await seller.save();
        res.status(200).json({
          message: "Seller updated successfully",
          status: 200,
          data: seller,
        });
      } else {
        res.status(404).json({ error: "Seller not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

const deleteSellerById = async (req, res) => {
  try {
    const seller = await Seller.findByPk(req.params.id);
    if (seller) {
      await seller.destroy();
      res.status(204).json({
        message: "Seller deleted successfully",
        status: 204,
      });
    } else {
      res.status(404).json({ error: "Seller not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { createSeller, getSellerById, updateSellerById, deleteSellerById };
