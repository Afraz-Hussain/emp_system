import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs"
import path from "path"

const prisma = new PrismaClient();

// Upload 
export const uploadProfilePic = async (req: any, res: Response) => {
  try {
    
    const userId = req.user.userId; 
    const imagePath = req.file?.filename;

    if (!imagePath) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const profile = await prisma.profile.upsert({
      where: { user_id:userId },

      update: { profile_pic: imagePath },
      create: { user_id: userId, profile_pic: imagePath },
    });

    res.status(200).json({ message: "Profile picture uploaded", profile });
   

  } catch (error) {
    console.error("Upload profile picture error:", error);
    res.status(500).json({ error: "Failed to upload profile picture" });
  }
};
// to delete image from dP
export const deleteprofile=async(req:Request,res:Response)=>{
    const userId=Number(req.params.userId)
    try {
      // Finding profile 
      const profile = await prisma.profile.findUnique({
        where: { user_id: userId },
      });
  
      if (!profile || !profile.profile_pic) {
        return res.status(404).json({ error: "No profile picture found" });
      }
  
     
      const filePath = path.join("../upload_pics", profile.profile_pic);// here folder name and db col name will come 
  
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // delete file
      }
  
      // Update DB  remove picture reference
      await prisma.profile.update({
        where: { user_id: userId },
        data: { profile_pic: null },
      });
  
      res.status(200).json({ message: "Profile picture deleted successfully" });
    } catch (error) {
      console.error("Delete profile picture error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
};
// add details 
export const updateprofile = async (req: any, res: Response) => {
  const userId = req.user.userId;
  const { address, city, gender } = req.body;

  try {
    const makeprofile = await prisma.profile.upsert({
      where: { user_id: userId },
      update: { city, gender, address },
      create: { user_id: userId, city, gender, address },
    });

    return res.status(200).json({
      message: "Profile picture has been updated",
      profile: makeprofile,
    });
  } catch (error) {
    console.error("Update profile details error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
