import express from "express";
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRoleById,
  deleteRoleById,
} from "../../controllers/user.role.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-role", createRole);
router.get("/getAllRoles", authenticateToken, getAllRoles);
router.get("/getRoleById/:id", authenticateToken, getRoleById);
router.put("/updateRoleById/:id", authenticateToken, updateRoleById);
router.delete("/deleteRoleById/:id", authenticateToken, deleteRoleById);

export default router;
