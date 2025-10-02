import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const markAttendance = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId; 
    
    const today = new Date();

    // today's boundaries
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // whole day

    const checkAttendance = await prisma.attandance.findFirst({
      where: {
        user_id: userId,
        date: { gte: startOfDay, lte: endOfDay },
      },
    });

    if (checkAttendance) {
      return res.json({ message: "Already attendance has been marked" });
    }

    // Create new attendance with check-in time
    const attendance = await prisma.attandance.create({
      data: {
        user_id: userId,
        date: new Date(),
        check_in: new Date(),
        status: true,
      },
    });

    res.status(200).json({ message: "Checked in successfully", attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
