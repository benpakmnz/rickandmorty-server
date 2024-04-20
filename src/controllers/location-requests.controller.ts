import { NextFunction, Request, Response } from "express";
import { LocationReqModel } from "../models/location-requests";

export const getAllLocationRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requests = await LocationReqModel.find();
    res.status(201).send(requests);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch location requests", error });
  }
};

export const postLocationRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const locationRequest = await LocationReqModel.create(req.body);
    return res.status(201).send(locationRequest);
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed adding request", error: error.message });
  }
};

export const deleteLocationRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const locationID = req.params.id;
    await LocationReqModel.findByIdAndDelete(locationID);
    return res.status(201).json({ message: "Succsess deleting request" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed deleting request", error: error.message });
  }
};
