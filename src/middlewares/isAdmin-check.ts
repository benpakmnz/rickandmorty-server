import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getIsAdmin } from "../common/helpers/isAdmin";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const isAdminCheck = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.method === "OPTIONS") {
      return next();
    }
    const isUserAdmin = await getIsAdmin(req);
    if (!isUserAdmin) {
      return res.status(401).json({ message: "Unauthorized...." });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized...." });
  }
};
