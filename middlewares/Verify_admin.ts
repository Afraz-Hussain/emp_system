// middlewares/authorizeRoles.ts
import { Request, Response, NextFunction } from "express";

export const authorizeRoles = (...allowedRoles: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    if (!allowedRoles.includes(user.role_id)) {
      return res.status(403).json({ message: "Access denied: insufficient role" });
    }
    next();
  };
};