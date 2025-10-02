// user route


import express from "express"
import { getUsers,getSingUser,updateUser, deleteUser } from "../controllers/users";
const router = express.Router();

import { verifyToken } from "../middlewares/middleware";
import {authorizeRoles} from "../middlewares/Verify_admin";


router.get("/allusers",verifyToken,authorizeRoles(1),getUsers);
router.get("/singleuser/:id",verifyToken,authorizeRoles(1),getSingUser)
router.put("/updateuser/:id",verifyToken,authorizeRoles(1),updateUser)
router.delete("/deleteUser/:id",verifyToken,authorizeRoles(1),deleteUser)

export default router;