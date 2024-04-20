import express from "express";
import {
  addLocation,
  deleteLocationRequest,
  getAllLocationRequests,
  postLocationRequest,
} from "../controllers/location-requests.controller";
import { isAdminCheck } from "../middlewares/isAdmin-check";

const router = express.Router();

router.post("/", postLocationRequest);
router.get("/", getAllLocationRequests);
router.delete("/:id", deleteLocationRequest);
router.use(isAdminCheck);
router.post("/add-location", addLocation);

export { router as locationRequestRouter };
