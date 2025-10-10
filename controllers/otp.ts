import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {otpQueue} from "../src/Queue/Otp_queue"
const prisma = new PrismaClient();
export const generateOtp = async (req: Request, res: Response) => {
  try {
    const userEmail = (req as any).user?.email;

    if (!userEmail) {
      return res.status(401).json({ message: "User email not found" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.otp.updateMany({
      where: {
        otp_email: userEmail,// will get userEmail 
        is_verified: false,
        is_expired: false,
      },
      data: {
        is_expired: true,
      },
    });

    // ✅ Create new OTP record in DB
    const otpRecord = await prisma.otp.create({
      data: {
        otp_code: otp,
        otp_email: userEmail,
      },
    });
    await otpQueue.add(
      "sendOtp",
      { to: userEmail, otp },
      {
        attempts: 3, 
        backoff: { type: "exponential", delay: 10000 }, 
        removeOnComplete: true,
        removeOnFail: false,
      }
    );

    return res.status(200).json({
      message: "OTP job added to queue successfully",
      otp_id: otpRecord.otp_id,
    });
  } catch (error) {
    console.error("❌ Error generating OTP:", error);
    return res.status(500).json({ message: "Failed to generate OTP" });
  }
};
export const checkOtp = async (req: Request, res: Response) => {
  try {
    const userEmail = (req as any).user?.email;
    console.log(userEmail)
    const { otp_code } = req.body;
    console.log(otp_code)// why this is giving undefined

    if (!userEmail) {
      return res.status(401).json({ message: "User email not found" });
    }

    if (!otp_code) {
      return res.status(400).json({ message: "OTP is required" });
    }

    // ✅ Get latest OTP
    const checkcode = await prisma.otp.findFirst({
      where: {
        otp_email: userEmail,
        otp_code: otp_code,
        is_verified: false,
        is_expired: false,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (!checkcode) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    // ✅ Check expiration (5 minutes)
    const createdAt = new Date(checkcode.created_at);
    const now = new Date();
    const minutesPassed = (now.getTime() - createdAt.getTime()) / (1000 * 60);

    if (minutesPassed > 5) {
      await prisma.otp.update({
        where: { otp_id: checkcode.otp_id },
        data: { is_expired: true },
      });
      return res.status(400).json({
        message: "OTP has expired. Please request a new one.",
      });
    }
    await prisma.otp.update({
      where: { otp_id: checkcode.otp_id },
      data: { is_verified: true },
    });
    // will make user as is_verified 

    await prisma.user.update({
      where: { email:userEmail },
      data: { is_verified: true },
    });


    return res.status(200).json({
      message: "OTP verified successfully!",
    });
  } catch (error) {
    console.error("❌ Error verifying OTP:", error);
    return res.status(500).json({ message: "Error verifying OTP" });
  }
};

export const deleteotp = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const expiredTime = new Date(now.getTime() - 5 * 60 * 1000); // here i will find time 5mins
    const deleted = await prisma.otp.deleteMany({
      where: {
        is_verified: false,// if opt is not verified then we will delete that
        created_at: {
          lt: expiredTime, 
        },
      },
    });
    return res.status(200).json({
      message: "Expired OTPs deleted successfully",
      deletedCount: deleted.count,
    });
  } catch (error) {
    console.error("Error deleting OTPs:", error);
    return res.status(500).json({ message: "Error deleting expired OTPs" });
  }
};
