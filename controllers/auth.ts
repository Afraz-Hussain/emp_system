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
          role_id: role_id||null,       
          dept_id: dept_id || null,// check convention
        },
      });   
  
      res.status(201).json({ message: "New user registered", user: newUser });
    } catch (err) {
      console.error("Error in register:", err);
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

// only super admin will assign role to users based on id and rle id

export const assignRole = async (req: Request, res: Response) => {
    try {
      const { userId, roleId } = req.body;
  
      if (!userId || !roleId) {
        return res.status(400).json({ message: "userId and roleId are required" });
      }
  
      // Check if role exists
      const role = await prisma.role.findUnique({
        where: { role_id: roleId }
      });
  
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
  
      // Update user role
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role_id: roleId },
        include: { role: true }
      });
  
      return res.status(200).json({
        message: "Role assigned successfully",
        user: updatedUser
      });
    } catch (error) {
      console.error("Error assigning role:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };


  export const assignDept=async(req:Request,res:Response)=>{
        try {
          const { userId, department_id } = req.body;
      
          const user = await prisma.user.findUnique({
            where: { id: userId }
          });
          
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }

          if (!userId || !department_id) {
            return res.status(400).json({ message: "userId and departmentId are required" });
          }
      
          // Check if department exists
          const department = await prisma.department.findUnique({
            where: { department_id: department_id }
          });
      
          if (!department) {
            return res.status(404).json({ message: "Department not found" });
          }
      
          // Update user's department
          const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { dept_id: department_id },
            include: { department: true }
          });
      
          return res.status(200).json({
            message: "Department assigned successfully",
            user: updatedUser
          });
        } catch (error) {
          console.error("Error assigning department:", error);
          return res.status(500).json({ message: "Internal server error" });
        }
      };