import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  user_id: number;
  username: string;
  role_id: number;
}
 // make another token verifyRole 
export const verifyRole = (role_id: number) => (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user as JwtPayload;

  if (user.role_id !== role_id) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token =req.cookies.access_token || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided, authorization denied" });
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be defined in environment variables");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    (req as any).user = decoded;  
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};