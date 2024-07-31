/** @format */

import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { chatService } from "./chat.service.js";

const createChat = catchAsync(async (req, res) => {
  const chat = await chatService.createChat(req.body);
  sendResponse(res, 200, true, "chat list create successfully", chat);
});

const myChatList = catchAsync(async (req, res) => {
  const chat = await chatService.getMyChatList(req.params.userId);
  sendResponse(res, 200, true, "chat list get successfully", chat);
});

const getChatById = catchAsync(async (req, res) => {
  const chat = await chatService.getChatById(req.params.id);
  sendResponse(res, 200, true, "chat get successfully", chat);
});

const updateChat = catchAsync(async (req, res) => {
  const chat = await chatService.updateChatList(req.params.id, req.body);
  sendResponse(res, 200, true, "chat update successfully", chat);
});

const deleteChat = catchAsync(async (req, res) => {
  const chat = await chatService.deleteChatList(req.params.id);
  sendResponse(res, 200, true, "chat delete successfully", chat);
});

export const chatController = {
  createChat,
  myChatList,
  getChatById,
  updateChat,
  deleteChat,
};
