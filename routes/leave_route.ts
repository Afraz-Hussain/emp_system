import express from "express"
const router = express.Router();
import { verifyToken }
from "../middlewares/middleware";
import { authorizeRoles } from "../middlewares/Verify_admin";
import { createleave,updateleave,getMyLeaves } from "../controllers/leaves";

router.post("/createleave",verifyToken,createleave)
router.put("/updateleave/:leave_id",verifyToken,authorizeRoles(1),updateleave)
router.get("/myleaves", verifyToken, getMyLeaves);
export default router