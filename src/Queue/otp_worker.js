// workers/otpWorker.ts
import { Worker } from "bullmq";
import IORedis from "ioredis";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
//connection
const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});
//to send mail
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.Email_user,
    pass: process.env.Email_pass,
  },
});

const otpWorker = new Worker("otpQueue",async (job) => {
    console.log(` Sending OTP to: ${job.data.to}`);

    const { to, otp } = job.data;

    await transporter.sendMail({
      from: `"SuperAdmin" <${process.env.Email_user}>`,
      to,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    });

    console.log(`OTP email sent successfully to ${to}`);
    return { success: true, to };
  },
  {
    connection,
    concurrency: 5,
  }
);
otpWorker.on("completed", (job) => {
  console.log(`🎉 OTP Job ${job.id} completed`);
});
otpWorker.on("failed", (job, err) => {
  console.error(`OTP Job ${job?.id} failed:`, err.message);
});
console.log("OTP Worker started and listening for jobs...");
