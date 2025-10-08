import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
export const createleave = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId

    const { reason, start_date, end_date } = req.body

    if (!start_date || !end_date || !reason) {
      return res.status(400).json({ message: "information is required!" });
    }

    const leave = await prisma.leaves.create({
      data: {
        user_id: userId,
        reason,
        start_date: new Date(start_date),
        end_date: new Date(end_date)
      }
    })
    res.status(201).json({
      message: "leave has been applied ",
      leave
    })
  }
  catch (error) {
    console.log("leave creation error", error)
    res.status(500).json({ error: "Internal server error" });
  }
}
export const updateleave = async (req: any, res: Response) => {
  try {
    const { leave_id } = req.params;
    const { status } = req.body;

    if (req.user.role_id !== 1) {
      return res.status(403).json({ message: "Access denied: only SuperAdmin can approve/reject leaves" });
    }

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leave = await prisma.leaves.update({
      where: { leave_id: Number(leave_id) },
      data: { status },
    });

    return res.status(200).json({ message: `Leave ${status}`, leave });
  } catch (error) {
    console.error("Error updating leave:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getMyLeaves = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const leaves = await prisma.leaves.findMany({
      where: { user_id: userId },
    });
    if (!leaves.length) {
      return res.status(404).json({ message: "No leave records found" });
    }
    res.status(200).json({ message: "Leaves are", leaves });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
