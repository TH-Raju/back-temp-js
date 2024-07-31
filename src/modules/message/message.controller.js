/** @format */

import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { messageService } from "./message.service.js";

//send message
const sendMessage = catchAsync(async (req, res) => {
  if (req?.file) {
    const uploadS3 = "{url}";
    req.body.content.path = uploadS3;
  }
  const message = await messageService.createMessage(req.body);
  // io.emit(`new-chat::${req.body.receiver}`, {
  //   totalUnread: newChatCount + 1,
  // });

  sendResponse(res, 200, true, "message sent successfully", message);
});

//get message by chat Id
const getMessageByChatId = catchAsync(async (req, res) => {
  const message = await messageService.getMessageByChatId(req.params.chatId);
  sendResponse(res, 200, true, "message get successful", message);
});

//get message by _id
const getMessageById = catchAsync(async (req, res) => {
  const message = await messageService.getMessageById(req.params.id);
  sendResponse(res, 200, true, "message get successful", message);
});

//update message
const updateMessage = catchAsync(async (req, res) => {
  if (req?.file) {
    const uploadS3 = "{url}";
    req.body.content.path = uploadS3;
  }
  const message = await messageService.updateMessage(req.params.id, req.body);
  sendResponse(res, 200, true, "message update successful", message);
});

//delete message

const deleteMessage = catchAsync(async (req, res) => {
  const message = await messageService.deleteMessage(req.params.id);
  sendResponse(res, 200, true, "message delete successful", message);
});

export const messageController = {
  sendMessage,
  getMessageByChatId,
  getMessageById,
  updateMessage,
  deleteMessage,
};
