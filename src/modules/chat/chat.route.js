/** @format */

import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import { chatValidation } from "./chat.validation.js";
import { chatController } from "./chat.controller.js";

const chatRouter = Router();

chatRouter.post(
  "/",
  validateRequest(chatValidation.createChatValidation),
  chatController.createChat
);

chatRouter.patch("/", chatController.updateChat);

chatRouter.delete("/", chatController.deleteChat);

chatRouter.get("/myChat/:userId", chatController.myChatList);
chatRouter.get("/:id", chatController.getChatById);

export default chatRouter;
