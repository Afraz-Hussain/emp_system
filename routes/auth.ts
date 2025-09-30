import express from "express"
const router = express.Router();

import { registeruser, loginUser, assignRole,assignDept } from "../controllers/auth";
import { verifyToken } from "../middlewares/middleware";

router.post("/register",registeruser);
router.post("/login",loginUser);
router.put("/assign-role", verifyToken, assignRole)
router.put("/assign-dept",verifyToken,assignDept)
export default router;

