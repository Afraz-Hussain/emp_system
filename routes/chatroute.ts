import express from "express"

const router = express.Router();

import { verifyToken }
from "../middlewares/middleware";
import { authorizeRoles } from "../middlewares/Verify_admin";
import {addMembers,getMembers} from "../controllers/chatapp"
router.post("/addmember",verifyToken,authorizeRoles(1),addMembers)// superAdmin can add users in already created group!
// to get user in room

router.get("/getmembers/:roomId",verifyToken,authorizeRoles(1),getMembers)// to get all member in room using roomId 

// socket.io work where group of users can do chat wiht each ohter and with Hr also


export default router
