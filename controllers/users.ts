// user controller

import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const register=async (req:Request,res:Response)=>{
    const {name,username,email,password,phone,role_id}=req.body;
    try{
        const user=await prisma.user.create({
            data:{
                name,
                username,
                email,
                password,
                phone,
                role_id,
            }
        })
        res.status(201).json(user);
    }catch(error){
        res.status(400).json({error:"Failed to register user"});
    }
}

