import express from "express";
import { settingsController } from "./settings.controller.js";

const settingsRouter = express.Router();

settingsRouter
  .get("/", settingsController.getAllSettings)
  .put("/", settingsController.updateSetting)
  .post("/add", settingsController.addSetting);

export default settingsRouter;
