import express from "express";
import { verifyToken } from "../middlewares/middleware";
import{authorizeRoles} from "../middlewares/Verify_admin"
import { checkOtp, generateOtp } from "../controllers/otp";
const router = express.Router();

router.post("/createotp",verifyToken,generateOtp)//router to create otp 

// to verify the code

router.post("/verifyotp",verifyToken,checkOtp)

export default router