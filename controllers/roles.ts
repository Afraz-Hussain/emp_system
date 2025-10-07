import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();
// CREATE ROLE
export const createRole = async (req: Request, res: Response) => {
  try {
    const { rolename, roledesc } = req.body;
    const user = (req as any).user; // set in verifyToken middleware

    if (!user) {
      return res.status(401).json({
        message: "No token provided, authorization denied",
      });
    }
    const roledata = await prisma.role.create({
      data: {
        rolename,
        roledesc,
       createdBy:user.userId
      },
    });

    return res.status(201).json({
      message: "Role created successfully",
      roledata,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error creating role", error });
  }
};
// GET ALL ROLES
export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.role.findMany({});

    return res.status(200).json(roles);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching roles", error });
  }
};
// GET ROLE BY ID
export const getRoleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = await prisma.role.findUnique({
      where: { role_id: Number(id) },
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    return res.status(200).json(role);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching role", error });
  }
};
// UPDATE ROLE
export const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rolename, roledesc } = req.body;

    const updatedRole = await prisma.role.update({
      where: { role_id: Number(id) },
      data: { rolename, roledesc },
    });

    return res.status(200).json({
      message: "Role updated successfully",
      updatedRole,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating role", error });
  }
};
// Assign role
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
    if (!userId) {
      return res.status(404).json({ message: "userID not found" });
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
// DELETE ROLE
export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.role.delete({
      where: { role_id: Number(id) },
    });

    return res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting role", error });
  }
};
