import express, { Request, Response } from "express";
import { json } from "body-parser";
import dotenv from "dotenv";
import { NotFoundError } from "./common/errors/not-found-error";
import { errorHandler } from "./middlewares/error-handler";
import { authRouter } from "./routes/auth.routes";
import { locationRouter } from "./routes/location.routes";
import { locationRequestRouter } from "./routes/location-requests.routes";
import { isLogedin } from "./middlewares/auth-check";

dotenv.config();

const app = express();

app.use(json());

app.get("/", (req: Request, res: Response) => {
  res.send("rickandmorty-api");
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", `*`);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, User-Id"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/auth", authRouter);
app.use(isLogedin);
app.use("/api/location", locationRouter);
app.use("/api/location-req", locationRequestRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
