import express from "express"

const router = express.Router();

import { createdept,getdepts, getactivedept,getsingledept,updatedept,deletedept } 
from "../controllers/departments";

import { verifyToken }
from "../middlewares/middleware";

// to create department
router.post("/createdept",verifyToken,createdept);
// to get all departments
router.get("/getdept",verifyToken,getdepts);
// to get all departments which are active
router.get("/getdept",verifyToken,getactivedept);
// to get single department based on id
router.get("/getsingledept/:id",verifyToken,getsingledept);
// to update department
router.put("/updatedept/:id",verifyToken,updatedept);
// to delete departments...
router.delete("/deletedept/:id",verifyToken,deletedept);
export default router;

