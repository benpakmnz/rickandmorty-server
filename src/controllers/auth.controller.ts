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
  const { email, name, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Can't signup at the moment please try again later." });
  }

  if (existingUser) {
    return res
      .status(401)
      .json({ message: "Unauthorized. user allready exists." });
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {}

  const createdUser = await User.create({
    name,
    email,
    password: hashedPassword,
    isAdmin: false,
  });

  let token;
  try {
    token = jwt.sign({ userId: createdUser.id }, "supersecret_dont_share", {
      expiresIn: "1h",
    });
  } catch (error) {}
  const loggedUser = { ...createdUser.toJSON(), password: undefined };
  res.status(201).json({ user: loggedUser, token: token });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req?.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {}

  if (!existingUser) {
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {}

  if (!isValidPassword) {
  }

  let token;
  try {
    token = jwt.sign({ userId: existingUser.id }, "supersecret_dont_share", {
      expiresIn: "1h",
    });
  } catch (error) {}
  const loggedUser = { ...existingUser.toJSON(), password: undefined };
  res.status(201).json({ user: loggedUser, token: token });
};

export const autoLogin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  let user;
  try {
    user = await User.findById({ id: req.userId });
  } catch (err) {}

  if (!user) {
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }

  let token;
  try {
    token = jwt.sign({ userId: req.userId }, "supersecret_dont_share", {
      expiresIn: "1h",
    });
  } catch (error) {}
  const loggedUser = { ...user.toJSON(), password: undefined };
  res.status(201).json({ user: loggedUser, token: token });
};
