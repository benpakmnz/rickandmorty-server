import express from "express";
import { login, signup, autoLogin } from "../controllers/auth.controller";
import { isLogedin } from "../middlewares/auth-check";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.use(isLogedin);
router.get("/autologin", autoLogin);

export { router as authRouter };
