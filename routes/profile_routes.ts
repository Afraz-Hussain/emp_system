import express from "express";
import { upload } from "../middlewares/uploads";
import { uploadProfilePic,deleteprofile,updateprofile } from "../controllers/profile";
import { verifyToken } from "../middlewares/middleware";

const router = express.Router();

router.post("/pic",verifyToken,upload.single("profile_pic"), uploadProfilePic);// to upload profile pic

router.delete("/deletepic/:userId", verifyToken, deleteprofile); // to delete profile picture

// to add further details

router.post("/adddetail/",verifyToken,updateprofile)


export default router;
