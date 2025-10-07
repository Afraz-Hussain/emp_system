import express from "express";
const router = express.Router();

import { verifyToken } from "../middlewares/middleware";
import {authorizeRoles} from "../middlewares/Verify_admin";

import { createRole, getRoles, getRoleById, updateRole, deleteRole,assignRole } from "../controllers/roles";

// Only super admin should have access (verifyToken + role check)
router.post("/createrole", verifyToken,authorizeRoles(1), createRole);
router.get("/roles", verifyToken,authorizeRoles(1,2), getRoles);
router.get("/roles/:id", verifyToken,authorizeRoles(1), getRoleById);
router.put("/updaterole/:id", verifyToken,authorizeRoles(1), updateRole);
router.delete("/deleterole/:id", verifyToken,authorizeRoles(1,2), deleteRole);
router.put("/assign-role", verifyToken,authorizeRoles(1), assignRole)

export default router;
