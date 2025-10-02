import express from "express"

const router = express.Router();

import { createdept,getdepts, getactivedept,getsingledept,updatedept,deletedept } 
from "../controllers/departments";



import { verifyToken }
from "../middlewares/middleware";
import { authorizeRoles } from "../middlewares/Verify_admin";

// to create department
router.post("/createdept",verifyToken,authorizeRoles(1),createdept);
// to get all departments
router.get("/getdept",verifyToken,authorizeRoles(1),getdepts);
// to get all departments which are active
router.get("/getactivedept",verifyToken,authorizeRoles(1),getactivedept);
// to get single department based on id
router.get("/getsingledept/:id",verifyToken,authorizeRoles(1),getsingledept);
// to update department
router.put("/updatedept/:id",verifyToken,authorizeRoles(1),updatedept);
// to delete departments...
router.delete("/deletedept/:id",verifyToken,authorizeRoles(1),deletedept);
export default router;

