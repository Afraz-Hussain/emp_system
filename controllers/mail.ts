import { Request, Response } from "express";
import { emailQueue } from "../src/Queue/email_queue";

export const sendmail = async (req: Request, res: Response) => {
  const { to, subject, text } = req.body;
  console.log("to send:", to, "subject is:", subject, "text", text);

  try {
    await emailQueue.add("sendEmail", { to, subject, text });
    res.status(200).json({
      message: "Email job added successfully. It will be sent shortly!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to queue email" });
  }
};

export const sharefile = async (req: Request, res: Response) => {
 const { to, subject, text } = req.body;
console.log("to: ",to,"subject ",subject)

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  await emailQueue.add("sendEmailWithAttachment", {
    to,
    subject,
    text,
    file: {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      buffer: req.file.buffer.toString("base64"),
    },
  });
console.log(File)
  res.json({ message: "Email job added successfully" });
};
