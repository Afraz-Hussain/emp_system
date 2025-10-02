// user controller

import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getUsers=async (req:Request,res:Response)=>{
    try{
        const users=await prisma.user.findMany();
        res.status(200).json(users);
    }catch(error){
        res.status(400).json({error:"Failed to get users"});
    }
}

export const getSingUser=async(req:Request,res:Response)=>{
    const {id}=req.params

    const finduser=await prisma.user.findUnique({
        where :{id: Number(id)}
    })
    if(!finduser){
        return res.status(400).json({error:"User not found"});
    }
    res.status(200).json(finduser);
}

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = Number(id);
    const { name,username, email, phone,roleId,deptId } = req.body;
  
    try {
      const updateuser = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
          username,
          email,
          phone,
          role_id:Number(roleId),
          dept_id:Number(deptId)

         
        },
      });
      console.log(roleId,deptId)
      res.status(200).json(updateuser);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update user" });
    }
  };

export const deleteUser=async(req:Request,res:Response)=>{
    const {id}=req.params
    try{
        const deleteuser=await prisma.user.delete({
            where :{id: Number(id)}
        })
        res.status(200).json(deleteuser);
    }catch(error){
        res.status(400).json({error:"Failed to delete user"});
    }
}


