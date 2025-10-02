import express from "express";

import { verifyToken } from "../middlewares/middleware";
import {markAttendance} from "../controllers/attandance"


const router = express.Router();

router.post("/markattandance/:userId",verifyToken,markAttendance)

export default router