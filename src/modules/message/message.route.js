/** @format */

import { Router } from "express";
// import multer, { memoryStorage } from "multer";
import { messageController } from "./message.controller.js";
import parseData from "../../middlewares/parseData.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { sendMessageValidation } from "./message.validation.js";

const MessageRouter = Router();
// const storage = memoryStorage();
// const upload = multer({ storage });

MessageRouter.post(
  "/",
  // upload.single("document"),
  parseData(),

  // validateRequest(sendMessageValidation.sendMessageValidateZodSchema),
  messageController.sendMessage
);

MessageRouter.get(
  "/chat-messages/:chatId",
  messageController.getMessageByChatId
);

MessageRouter.patch(
  "/:id",
  // upload.single("document"),
  parseData(),
  messageController.updateMessage
);

MessageRouter.delete("/:id", messageController.deleteMessage);
MessageRouter.get("/:id", messageController.getMessageById);

export default MessageRouter;
