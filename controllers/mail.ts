import { Request, Response } from "express";
import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.Email_user as string,
    pass: process.env.Email_pass as string,
  },
});

export const sendmail = async (req: Request, res: Response) => {
  const { to, subject, text } = req.body;

  try {
    const info = await transporter.sendMail({
      from: `"SuperAdmin" <${process.env.Email_user}>`,
      to,
      subject,
      text,
    });
    res.status(200).json({ message: "Email sent successfully", info });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Email not sent" });
  }
};

export const sharefile = async (req: Request, res: Response) => {
    const { to, subject, text } = req.body;
    const file=req.file as Express.Multer.File
    try {
      
        const mailOptions: any = {
            from: `"SuperAdmin" <${process.env.Email_user}>`,
            to,
            subject,
            text,
          };
      
          // Add attachment if uploaded
          if (file) {
            mailOptions.attachments = [
              {
                filename: file.originalname,
                path: file.path,
              },
            ];
          }
      
          const info = await transporter.sendMail(mailOptions);
          res.status(200).json({ message: "Email sent successfully", info });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Email not sent" });
    }
  };