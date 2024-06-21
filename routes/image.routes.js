import express from "express";
import { getAllImages, uploadImage } from "../controllers/image.controllers.js";
import { upload } from "../config/cloudinary.config.js";

const router = express.Router();

router.post("/upload", upload.single("image"), uploadImage);
router.get("/getAllImages", getAllImages);

export default router;
