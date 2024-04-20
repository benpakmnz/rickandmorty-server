import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const isLogedin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("check", req.headers.authorization?.split(" ")[1]);
    if (req.method === "OPTIONS") {
      return next();
    }
    const token: any = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const decodedToken = jwt.verify(
      token,
      "supersecret_dont_share"
    ) as JwtPayload;
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized. Invalid token...." });
  }
};
