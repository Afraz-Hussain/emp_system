import express from "express";
const app=express()
// to use prisma client
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const PORT = 3000;
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import authRoute from "../routes/auth"
import deptRoute from "../routes/departments_route"
import roleRoute from "../routes/roles_route"
import userRoute from  "../routes/users_route"
import profileRoute from  "../routes/profile_routes"
import attandaceRoute from "../routes/attandance_route"
import leaveRoute from "../routes/leave_route"
import mailRoute from "../routes/mail_route"

app.use(express.json());
app.use(cookieParser());




app.use("/backend/auth", authRoute);// for login and register  

app.use("/backend/dept",deptRoute);// for departments creation only  by superAdmin...

app.use("/backend/roles",roleRoute)// to create roles only by super admin...

app.use("/backend/users",userRoute);// for all users 

// to upload images after loging 
app.use("/backend/profile",profileRoute)

// to mark attandance

app.use("/backend/attandance",attandaceRoute)

// for leaves
app.use("/backend/leave",leaveRoute)

// to send mails

app.use("/backend/sendmail",mailRoute)// send mail

app.listen(PORT, () => {
  console.log(` Server is listening on http://localhost:${PORT}`);
});
