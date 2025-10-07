// department.controller.ts

import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
// to create new department
export const createdept = async (req: Request, res: Response) => {
    const { departmentname, departmentdesc, status,departmenthead } = req.body;
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
// finding how many employees are in one department

const findemps = await prisma.user.count({
  where: { department: { departmentname } },
});


      const department = await prisma.department.create({
        data: {
          departmentname,
          departmentdesc,
          status: status ?? true, 
          departmenthead,
          total_employees:findemps,
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

//dept assignment...
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
    //this is to increment in count for finfing total employees in 1 dept
    await prisma.department.update({
      where: { department_id },
      data: { total_employees: { increment: 1 } },
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


// view your dept not whole depts

export const yourdept = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId; 
console.log(userId,"from top")
    const employee = await prisma.user.findUnique({
      where: { id: userId },
      include: { department: true }, 
    });
    console.log(employee,"emo")
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    return res.status(200).json({
      message: "Department details are: ",
      department: employee.department,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching department details" });
  }
};
