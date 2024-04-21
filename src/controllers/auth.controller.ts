import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../middlewares/auth-check";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, name, password, isAdmin } = req.body;

  try {
    let existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const createdUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin,
    });

    const token = jwt.sign(
      { userId: createdUser.id },
      "supersecret_dont_share",
      {
        expiresIn: "1h",
      }
    );
    const loggedUser = { ...createdUser.toJSON(), password: undefined };
    res.status(201).json({ user: loggedUser, token: token });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Could not create user." });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req?.body;

  try {
    let existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { userId: existingUser.id },
      "supersecret_dont_share",
      {
        expiresIn: "1h",
      }
    );
    const loggedUser = { ...existingUser.toJSON(), password: undefined };
    res.status(200).json({ user: loggedUser, token: token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Login failed." });
  }
};

export const autoLogin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized. Invalid token." });
    }
    const loggedUser = { ...user.toJSON(), password: undefined };
    res.status(200).json(loggedUser);
  } catch (error) {
    console.error("Error during auto login:", error);
    res.status(500).json({ message: "Auto login failed." });
  }
};
