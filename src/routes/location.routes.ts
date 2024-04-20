import express from "express";
import {
  addLocation,
  getResidents,
  getAllLocations,
  getLocationsByName,
  getLocationById,
} from "../controllers/location.controller";

const router = express.Router();
router.get("/", getAllLocations);
router.get("/:id", getLocationById);
router.post("/residents", getResidents);
router.get("/search/:name", getLocationsByName);

router.post("/", addLocation);

export { router as locationRouter };
