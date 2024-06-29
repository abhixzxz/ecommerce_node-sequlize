import express from "express";
import {
  addItemToCart,
  getCartItems,
  removeItemFromCart,
  updateCartItemQuantity,
} from "../controllers/cartController/cart.controller.js";

const router = express.Router();

router.post("/createCart", addItemToCart);
router.get("/getCart/:user_id", getCartItems);
router.put("/updateCart", updateCartItemQuantity);
router.delete("/delete/:cart_id", removeItemFromCart);

export default router;
