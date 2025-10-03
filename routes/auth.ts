import express from "express"
const router = express.Router();

import { registeruser, loginUser, assignRole } from "../controllers/auth";
import { verifyToken } from "../middlewares/middleware";
import  {authorizeRoles} from "../middlewares/Verify_admin"

router.post("/register",registeruser);
router.post("/login",loginUser);
router.put("/assign-role", verifyToken, assignRole)

export default router;

