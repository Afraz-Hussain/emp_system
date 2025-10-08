import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export const generateOtp = async (req: Request, res: Response) => {
  try {
    const userEmail = (req as any).user.email;
    console.log(userEmail)
    
    if (!userEmail) {
      return res.status(401).json({ message: "User email not found" });
    }

    
    const otp = Math.floor(100000 + Math.random() * 9000).toString();
    await prisma.otp.updateMany({
      where: {
        otp_email: userEmail,
        is_verified: false,
        is_expired: false,
      },
      data: {
        is_expired: true,
      },
    });

    // Create new OTP record
    const otpRecord = await prisma.otp.create({
      data: {
        otp_code: otp,
        otp_email: userEmail,
      },
    });

    // Send email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.Email_user,
        pass: process.env.Email_pass,
      },
    });

    await transporter.sendMail({
      from: `"SuperAdmin" <${process.env.Email_user}>`,
      to: userEmail,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    });

    res.status(200).json({
      message: "OTP sent successfully to your registered email",
      otp_id: otpRecord.otp_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate OTP" });
  }
};

export const checkOtp = async (req: Request, res: Response) => {
  try {
    // Get email from authenticated user
    const userEmail = (req as any).user?.email;
    
    if (!userEmail) {
      return res.status(401).json({ message: "User email not found" });
    }

    const { otp } = req.body;
    const checkcode = await prisma.otp.findFirst({
      where: {
        otp_email: userEmail,
        otp_code: otp,
        is_verified: false,
        is_expired: false,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    if (!checkcode) {
      return res.status(400).json({ 
        message: "Invalid or expired OTP" 
      });
    }

    // Check if OTP is expired (5 minutes)
    const gettime = new Date(checkcode.created_at);
    const nowtime = new Date();
    const checktime = (nowtime.getTime() - gettime.getTime()) / (1000 * 60);

    if (checktime > 5) {
      await prisma.otp.update({
        where: { otp_id: checkcode.otp_id },
        data: { is_expired: true },
      });
      return res.status(400).json({ 
        message: "OTP has expired. Please request a new one." 
      });
    }

    // Mark OTP as verified (THIS WAS MISSING!)
    await prisma.otp.update({
      where: { otp_id: checkcode.otp_id },
      data: { is_verified: true },
    });

    res.status(200).json({ 
      message: "OTP verified successfully!" 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};
