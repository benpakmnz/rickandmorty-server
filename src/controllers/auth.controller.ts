import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
    // const error = new HttpError(
    //   'Signing up failed, please try again later.',
    //   500
    // );
    // return next(error);
  }

  if (existingUser) {
    // const error = new HttpError(
    //   'User exists already, please login instead.',
    //   422
    // );
    // return next(error);
    return res
      .status(401)
      .json({ message: "Unauthorized. user allready exists." });
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    // const error = new HttpError(
    //   'Could not create user, please try again.',
    //   500
    // );
    // return next(error);
  }

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
  } catch (err) {
    //   const error = new HttpError(
    //     'Loggin in failed, please try again later.',
    //     500
    //   );
    //   return next(error);
  }

  if (!existingUser) {
    //   const error = new HttpError(
    //     'Invalid credentials, could not log you in.',
    //     401
    //   );
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
    token = jwt.sign(
      { userId: existingUser.id, isAdmin: false },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (error) {}

  res.json({
    user: existingUser.toObject({ getters: true }),
    token: token,
  });
};
