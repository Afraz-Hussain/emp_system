import express from "express";
const router = express.Router();
import { verifyToken } from "../middlewares/middleware";
import{authorizeRoles} from "../middlewares/Verify_admin"
import{sendmail,sharefile} from "../controllers/mail"
import multer from "multer"
//only superadmin and admin will send mail
const upload = multer({ dest: "uploads/" });
router.post("/sendmail",verifyToken,authorizeRoles(1,2),sendmail)
// to share file or attachment
router.post("/attachfile",verifyToken,authorizeRoles(1,2),upload.single("file"),sharefile)
export default router