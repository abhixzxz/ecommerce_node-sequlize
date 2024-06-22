import express from "express";
import {
  createSeller,
  deleteSellerById,
  getSellerById,
  updateSellerById,
} from "../controllers/sellerController/seller.controller.js";

const router = express.Router();

router.post("/createSellers", createSeller);
router.get("/sellers/:id", getSellerById);
router.put("/sellers/:id", updateSellerById);
router.delete("/sellers/:id", deleteSellerById);

export default router;
