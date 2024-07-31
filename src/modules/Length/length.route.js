import express from "express";
import { lengthController } from "./length.controller.js";
const lengthRouter = express.Router();

lengthRouter.get("/users", lengthController.getTotalUserLength);

export default lengthRouter;
