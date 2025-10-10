import express from "express";
import { verifyToken } from "../middlewares/middleware";
import { checkOtp, deleteotp, generateOtp } from "../controllers/otp";
const router = express.Router();


router.post("/createotp",verifyToken,generateOtp)//router to create otp 
// to verify the code
router.post("/verifyotp",verifyToken,checkOtp)
router.delete("/deleteotp",verifyToken,deleteotp)

export default router