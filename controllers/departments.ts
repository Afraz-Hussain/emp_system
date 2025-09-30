// department.controller.ts

import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
// to create new department
export const createdept = async (req: Request, res: Response) => {
    const { departmentname, departmentdesc, status } = req.body;
    const user = (req as any).user; // this will treat req object to as having the any type
    if (!user) {
      return res.status(401).json({
        message: "No token provided, authorization denied",
      });
    }
    if (!departmentname || !departmentdesc) {
      return res.status(400).json({ message: "Name and description are required" });
    }  
    try {
      const department = await prisma.department.create({
        data: {
          departmentname,
          departmentdesc,
          status: status ?? true, 
          createdBy: user.userId, 
        },
      });
  
      return res.status(201).json({
        message: "Department created successfully",
        department,
      });
    } catch (error) {
      return res.status(500).json({ message: "Error creating department", error });
    }
  };
  // to view only those departments which are active 
export const getactivedept=async(req:Request,res:Response)=>{
    try {
        const department = await prisma.department.findMany({
            where:{
                status:true
            }
        })
        return res.status(200).json({
            message: "Department fetched successfully",
            department,
          });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching department", error });
    }
};
// to view All departments
export const getdepts = async (req: Request, res: Response) => {
  try {
    const getall = await prisma.department.findMany();

    if (getall.length === 0) {
      return res.status(404).json({ message: "No departments found" });
    }

    return res.status(200).json({
      message: "Departments fetched successfully",
      departments: getall,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching departments", error });
  }
};

// to view single departments..
export const getsingledept=async(req:Request,res:Response)=>{
    const {id}=req.params;
    try {
        const find_department = await prisma.department.findUnique({
            where:{department_id:Number(id)}
        })
        if(!find_department){
            return res.status(404).json({
                message: "Department not found",
              });
        }
        return res.status(200).json({
            message: "Department fetched successfully",
            find_department,
          });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching department", error });
    }
}

// to update department
export const updatedept=async(req:Request,res:Response)=>{
    const {id}=req.params;
    const {departmentname,departmentdesc,status}=req.body;
    try {
        const find_department = await prisma.department.findUnique({
            where:{department_id:Number(id)}
        })
        if(!find_department){
            return res.status(404).json({
                message: "Department not found",
              });
        }
        const update_department = await prisma.department.update({
            where:{department_id:Number(id)},
            data:{
                departmentname,
                departmentdesc,
                status
            }
        })
        return res.status(200).json({
            message: "Department updated successfully",
            update_department,
          });
    } catch (error) {
        return res.status(500).json({ message: "Error updating department", error });
    }
}
// to delete department

export const deletedept = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const delete_dept = await prisma.department.delete({
      where: {
        department_id: Number(id),
      },
    });

    return res.status(200).json({
      message: "Department deleted successfully",
      department: delete_dept,
    });
  } catch (error: any) {
    if (error) {
      
      return res.status(404).json({ message: "Department not found" });
    }
    return res.status(500).json({ message: "Error deleting department", error });
  }
};

