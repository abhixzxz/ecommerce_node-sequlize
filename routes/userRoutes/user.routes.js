import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  loginUser,
} from "../../controllers/userConrollers/user.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-user", createUser);
router.post("/login", loginUser);
router.get("/getAllUsers", authenticateToken, getAllUsers);
router.get("/getuser-by-id/:id", authenticateToken, getUserById);
router.put("/updateUserById/:id", authenticateToken, updateUserById);
router.delete("/deleteUser/:id", authenticateToken, deleteUserById);

export default router;
