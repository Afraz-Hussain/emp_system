import express from "express";
import { verifyToken } from "../middlewares/middleware";
import { authorizeRoles } from "../middlewares/Verify_admin";
import { sendmail, sharefile } from "../controllers/mail";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
// only superadmin and admin will send mail
router.post("/sendmail", verifyToken, authorizeRoles(1, 2), sendmail);
router.post("/attachfile", verifyToken, authorizeRoles(1, 2), upload.single("file"), sharefile);

export default router;
