import * as bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const registeruser = async (req: Request, res: Response) => {
    const { name, username, email, password, phone,role_id, dept_id } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // create the user with role_id = null
      const newUser = await prisma.user.create({
        data: {
          name,
          username,
          email,
          password: hashedPassword,
          phone,
          role_id: role_id||4, // same as it will be assigned by admin...      
          dept_id: dept_id || null, // later will be assigned by superAdmin
        },
      });   
  
      res.status(201).json({ message: "New user  has been registered", user: newUser });
    } catch (err) {
      console.error("Error while register:", err);
      res.status(500).json({ message: "Error in register", error: err });
    }
  };

export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { username }
        });
        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "invalid password" });
        }
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET must be defined in the environment variables');
        }
        const token = jwt.sign(
            { userId: user.id, username: user.username,
                role_id:user.role_id },
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );
        const { password: _, ...others } = user;
        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).json(others);
       
        
    } catch (err: unknown) { 
        console.error("Error in login:", err);
        if (err instanceof Error) {
            return res.status(500).json({ message: "Error in login", error: err.message });
        }
        return res.status(500).json({ message: "An unknown error occurred" });
    }
};

// To logout 

export const logoutuser=async(req:Request,res:Response)=>{
    try{

        res.clearCookie("access_token", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
          });
      
          return res.status(200).json({ message: "User logged out successfully" });

    }
    catch(error){
res.status(500).json({message:"ERROR,",error})
    }
}



