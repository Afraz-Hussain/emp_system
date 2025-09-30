import express from "express";
const router = express.Router();

import { verifyToken } from "../middlewares/middleware";


import { createRole, getRoles, getRoleById, updateRole, deleteRole } from "../controllers/roles";

// Only super admin should have access (verifyToken + role check)
router.post("/createrole", verifyToken, createRole);
router.get("/roles", verifyToken, getRoles);
router.get("/roles/:id", verifyToken, getRoleById);
router.put("/updaterole/:id", verifyToken, updateRole);
router.delete("/roles/:id", verifyToken, deleteRole);

export default router;
