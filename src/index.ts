import express, { Request, Response } from "express";
// to use prisma client

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const app = express();
const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send(" TypeScript + Express server is running!");
});


app.get("/login",(req:Request,res:Response)=>{
    res.send("login route")
})

app.listen(PORT, () => {
  console.log(` Server is listening on http://localhost:${PORT}`);
});
