import express from "express";

import { verifyToken } from "../middlewares/middleware";
import {markAttendance,docheckout,deleteAttendance} from "../controllers/attandance"
import{authorizeRoles} from "../middlewares/Verify_admin"



const router = express.Router();

router.post("/markattandance/",verifyToken,markAttendance)// when a user login-in and userId will get passed after it will mark attendance
router.post("/markcheckout/",verifyToken,docheckout)
router.delete("/deletattandance/:attendanceId",verifyToken,authorizeRoles(1,3),deleteAttendance)
export default router