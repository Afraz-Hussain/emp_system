import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Server, Socket } from "socket.io";
const prisma = new PrismaClient();


// superAdmin can add users to group/room
export const addMembers = async (req: Request, res: Response) => {
  const admin = (req as any).user; 
  try {
    const { roomId, userId } = req.body;

    // Validation
    if (!roomId || !userId) {
      return res.status(400).json({ message: "roomId and userId are required" });
    }

    const roomIdInt = parseInt(roomId, 10);
    const userIdInt = parseInt(userId, 10);
   
    const findUser = await prisma.user.findUnique({
      where: { id: userIdInt },
    });

    if (!findUser) {
      return res.status(404).json({ message: "User not found!" });
    }
    const room = await prisma.chatRoom.findUnique({
      where: { id: roomIdInt },
    });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    const existingMember = await prisma.chatMember.findFirst({
      where: { roomId: roomIdInt, userId: userIdInt },
    });

    if (existingMember) {
      return res.status(400).json({ message: "User already in room" });
    }
    const newMember = await prisma.chatMember.create({
      data: { roomId: roomIdInt, userId: userIdInt },
    });
    await prisma.chatRoom.update({
      where: { id: roomIdInt },
      data: { totalmembers: { increment: 1 } },
    });

    return res.status(201).json({
      message: "Member added successfully",
      member: newMember,
    });

  } catch (error) {
    console.error("Error adding user to room:", error);
    return res.status(500).json({ message: "Server error while adding user" });
  }
};



// controller to get Members in chat room

export const getMembers=async(req:Request,res:Response)=>{
  
try{
  const{roomId}=req.params
  console.log("room Id is ",roomId)

  const totalmembers=await prisma.chatMember.findMany({
where:{roomId:Number(roomId)},
include:{
  user:{
    select:{
      id:true,
      username:true,
      email:true,
      phone:true
    }
  }
}


  })

  if(!totalmembers){
    res.status(409).json({message:"No users are in group"})
  }
  res.status(200).json({message:"Mmembers ",totalmembers})
}
catch(error){
  console.log(error)
  res.status(500).json({message:"Inter server error"})
}
}


// socket.io work when a user send messge in group 

export const registerChatHandlers = (io: Server, socket: Socket) => {
  console.log(" User connected:", socket.id);

  // When user joins a room
  socket.on("joinRoom", async ({ roomId, userId }) => {
    try {
      // Verify user is part of the room
      const isMember = await prisma.chatMember.findFirst({
        where: { roomId, userId },
      });

      if (!isMember) {
        socket.emit("error", { message: "You are requested to join this group firstly!!" });
        return;
      }

      socket.join(roomId.toString());
      console.log(`User ${userId} joined room ${roomId}`);
      socket.emit("joinedRoom", { roomId });
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("error", { message: "Failed to join room" });
    }
  });

  // When a message is sent
  socket.on("sendMessage", async ({ roomId, senderId, content }) => {
    try {
      // Check if user is a member of that room
      const isMember = await prisma.chatMember.findFirst({
        where: { roomId, userId: senderId },
      });

      if (!isMember) {
        socket.emit("error", { message: " You are not part of this room" });
        return;
      }

      // Save message in DB
      const message = await prisma.message.create({
        data: {
          roomId,
          senderId,
          content,
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });
      // everyone in room will see that message...
      io.to(roomId.toString()).emit("receiveMessage", message);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
};
