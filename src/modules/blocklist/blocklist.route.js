/** @format */

import express from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import { blockListValidation } from "./bloacklist.validation.js";
import { blocklistController } from "./blocklist.controller.js";

const blocklistRoute = express.Router();

blocklistRoute.post(
  "/block-user",
  validateRequest(blockListValidation.addBlockZodSchema),
  blocklistController.blockedThisProfile
);
blocklistRoute.post(
  "/unblock",
  validateRequest(blockListValidation.addBlockZodSchema),
  blocklistController.unBlockProfile
);
blocklistRoute.get("/:userId", blocklistController.getMyBlockList);

export default blocklistRoute;
