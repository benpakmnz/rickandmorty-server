import express from "express";
// import { isAdmin } from "../middlewares/auth-check";
import {
  deleteLocationRequest,
  getAllLocationRequests,
  postLocationRequest,
} from "../controllers/location-requests.controller";

const router = express.Router();

router.post("/", postLocationRequest);
// router.use(isAdmin);
router.get("/", getAllLocationRequests);
router.delete("/:id", deleteLocationRequest);

export { router as locationRequestRouter };
