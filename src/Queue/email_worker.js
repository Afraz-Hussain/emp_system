import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import IORedis from "ioredis";
import nodemailer from "nodemailer";

if (!process.env.Email_user || !process.env.Email_pass) {
  throw new Error("Email credentials missing in .env file!");
}
console.log("Email credentials loaded");
console.log("Email user:", process.env.Email_user);
// Redis connection
const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});
// Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.Email_user,
    pass: process.env.Email_pass,
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

// Worker for processing email jobs
const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    console.log(`📧 Processing job ${job.id} (${job.name})`);
    console.log("Job data:", job.data);

    try {
      if (job.name === "sendEmail") {
        const { to, subject, text } = job.data;

        const info = await transporter.sendMail({
          from: `"Your Company" <${process.env.Email_user}>`,
          to,
          subject,
          text,
          html: `
            <div>
              <h2>${subject}</h2>
              <p>${text}</p>
            </div>
          `,
        });

        console.log(` Email sent successfully to ${to}`);
        return { success: true, messageId: info.messageId };
      }

      if (job.name === "sendEmailWithAttachment") {
        const { to, subject, text, file } = job.data;

        if (!file || !file.buffer) {
          throw new Error("Attachment file is missing or invalid");
        }

        console.log(`📎 Sending email with attachment to: ${to}`);

        const info = await transporter.sendMail({
          from: `"Super Admin" <${process.env.Email_user}>`,
          to,
          subject,
          text,
          attachments: [
            {
              filename: file.originalname,
              content: Buffer.from(file.buffer, "base64"), 
              contentType: file.mimetype,
            },
          ],
        });

        console.log(` Email with attachment sent to ${to}`);
        return { success: true, messageId: info.messageId };
      }

      throw new Error(`Unknown job type: ${job.name}`);
    } catch (error) {
      console.error(` Failed to send email:`, error.message);
      throw error; // Trigger BullMQ retry
    }
  },
  {
    connection,
    concurrency: 5,
    limiter: {
      max: 10,
      duration: 1000,
    },
  }
);

// Worker events
emailWorker.on("completed", (job, result) => {
  console.log(` Job ${job.id} completed:`, result);
});

emailWorker.on("failed", (job, err) => {
  console.error(` Job ${job?.id} failed: ${err.message}`);
});

emailWorker.on("error", (err) => {
  console.error(" Worker error:", err);
});

console.log("📬 Email worker started and listening for jobs...");

export default emailWorker;
