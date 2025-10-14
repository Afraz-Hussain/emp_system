import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//  Create Chat Room (only by SuperAdmin)
export const createChatRoom = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const user = (req as any).user; // user info from JWT middleware

    if (!name) {
      return res.status(400).json({ message: "Room name is required" });
    }

    const room = await prisma.chatRoom.create({
      data: {
        name,
        createdBy: user.userId,
        totalmembers: 1, 
      },
    });

    return res.status(201).json({
      message: "Chat room created successfully",
      room,
    });
  } catch (error) {
    console.error("Error creating chat room:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// //  Get all rooms
export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await prisma.chatRoom.findMany({
        include: {
          members: {
            select: { id: true },
          },
        },
      });

    return res.status(200).json({ total: rooms.length, rooms });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return res.status(500).json({ message: "Failed to fetch rooms" });
  }
};
// 
