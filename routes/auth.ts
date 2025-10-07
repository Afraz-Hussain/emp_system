import express from "express"
const router = express.Router();

import { registeruser, loginUser,logoutuser } from "../controllers/auth";
import { verifyToken } from "../middlewares/middleware";
import  {authorizeRoles} from "../middlewares/Verify_admin"

router.post("/register",registeruser);
router.post("/login",loginUser);
router.post("/logout",logoutuser);


export default router;

