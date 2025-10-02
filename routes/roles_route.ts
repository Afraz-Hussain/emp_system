import express from "express";
const router = express.Router();

import { verifyToken } from "../middlewares/middleware";
import {authorizeRoles} from "../middlewares/Verify_admin";

import { createRole, getRoles, getRoleById, updateRole, deleteRole } from "../controllers/roles";

// Only super admin should have access (verifyToken + role check)
router.post("/createrole", verifyToken,authorizeRoles(1), createRole);
router.get("/roles", verifyToken,authorizeRoles(1), getRoles);
router.get("/roles/:id", verifyToken,authorizeRoles(1), getRoleById);
router.put("/updaterole/:id", verifyToken,authorizeRoles(1,3), updateRole);
router.delete("/deleterole/:id", verifyToken,authorizeRoles(3), deleteRole);

export default router;
