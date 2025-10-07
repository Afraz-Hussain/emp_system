import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import router from "../routes/auth";

const prisma = new PrismaClient();

export const markAttendance = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const now = new Date();

    // Create separate date objects to avoid mutation
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const checkAttendance = await prisma.attandance.findFirst({
      where: {
        user_id: userId,
        date: { gte: startOfDay, lte: endOfDay },
      },
    });

    if (checkAttendance) {
      return res.status(400).json({ message: "Attendance already marked for today" });
    }

    const attendance = await prisma.attandance.create({
      data: {
        user_id: userId,
        date: now,
        check_in: now,
        status: true,
      },
    });

    res.status(200).json({ message: "Checked in successfully", attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const docheckout = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // Check if attendance exists for today
    const checkAttendance = await prisma.attandance.findFirst({
      where: {
        user_id: userId,
        date: { gte: startOfDay, lte: endOfDay },
      },
    });

    if (!checkAttendance) {
      return res.status(400).json({ message: "Attendance not marked, please check-in first" });
    }

    if (checkAttendance.check_out) {
      return res.status(400).json({ message: "Already checked out for today" });
    }

    await prisma.attandance.update({
      where: {
        attandance_id: checkAttendance.attandance_id,
      },
      data: {
        check_out: now,
      },
    });

    res.status(200).json({ message: "Checked out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteAttendance = async(req: any, res: Response) => {
  try {
    const userid = req.user.userId;
    
    
    if (!userid || req.user.role_id !== 1) {
      return res.status(403).json({ error: "Only super admin can delete attendance" });
    }

    const attendanceId = Number(req.params.attendanceId);

    if (!attendanceId || isNaN(attendanceId)) {
      return res.status(400).json({ error: "Valid attendance ID is required" });
    }

    const attendance = await prisma.attandance.findUnique({
      where: { attandance_id: attendanceId },
    });

    if (!attendance) {
      return res.status(404).json({ error: "Attendance record not found" });
    }

    await prisma.attandance.delete({
      where: { attandance_id: attendanceId },
    });

    return res.status(200).json({ message: "Attendance deleted successfully" });
  } catch (err) {
    console.error("Delete attendance error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const viewattendace = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const attendanceRecords = await prisma.attandance.findMany({
      where: { user_id: userId },
      orderBy: { date: "desc" },
    });

    if (!attendanceRecords.length) {
      return res.status(404).json({ message: "No attendance records found" });
    }
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const todayRecord = attendanceRecords.find(
      (r) => r.date >= startOfDay && r.date <= endOfDay
    );

    const status = todayRecord ? "Present" : "Absent";
    return res.status(200).json({
      message: "Attendance fetched ",
      todayStatus: status,
      totalDaysPresent: attendanceRecords.length,
      records: attendanceRecords,
    });
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
