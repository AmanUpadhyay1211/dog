import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { registerDog, getAllDogInDb, getDogById } from "../controllers/dog.controller.js";

const dogRouter = Router();

dogRouter.route("/register").post(
  upload.array("dogImages", 4), // Correct syntax: field name as a string and max count as a number
  registerDog
);

dogRouter.route("/getdogbyid/:dogId").get(getDogById);

dogRouter.route("/getalldogs").get(getAllDogInDb);

export { dogRouter };
