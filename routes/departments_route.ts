import express from "express"

const router = express.Router();



import { verifyToken }
from "../middlewares/middleware";
import { authorizeRoles } from "../middlewares/Verify_admin";
import { createdept,getdepts, getactivedept,getsingledept,updatedept,deletedept,assignDept,yourdept } 
from "../controllers/departments";
// to create department
router.post("/createdept",verifyToken,authorizeRoles(1),createdept);
// to get all departments
router.get("/getdept",verifyToken,authorizeRoles(1,2),getdepts);
// to get all departments which are active
router.get("/getactivedept",verifyToken,authorizeRoles(1,2,5),getactivedept);
// to get single department based on id
router.get("/getsingledept/:id",verifyToken,authorizeRoles(1,2,5),getsingledept);
// to update department
router.put("/updatedept/:id",verifyToken,authorizeRoles(1,2),updatedept);
// to delete departments...
router.delete("/deletedept/:id",verifyToken,authorizeRoles(1),deletedept);

// to assign dept
router.put("/assign-dept",verifyToken,authorizeRoles(1,2),assignDept)


// only employees will see their dept in which they are added not others dept or whole depts

router.get("/yourdept",verifyToken,yourdept)
export default router;

