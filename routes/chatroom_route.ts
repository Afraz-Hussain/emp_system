import express from "express"
const router = express.Router();
import { verifyToken }from "../middlewares/middleware";

import { authorizeRoles } from "../middlewares/Verify_admin";
import{createChatRoom,getAllRooms} from "../controllers/chatroom"

router.post("/createroom",verifyToken,authorizeRoles(1),createChatRoom)

 router.get("/viewroom",verifyToken,authorizeRoles(1),getAllRooms)

export default router
