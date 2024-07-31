/** @format */

import httpStatus from "http-status";
import AppError from "../../errors/AppError.js";
import BlockList from "../blocklist/blocklist.model.js";
import Message from "./message.model.js";

//create a message
const createMessage = async (messageBody) => {
  const newMessge = await Message.create(messageBody);
  return newMessge.populate("chat", "participants");
};

//get message by chat id
const getMessageByChatId = (chatId) => {
  const result = Message.find({ chatId: chatId });
  if (!result) {
    throw new AppError("message not found");
  }
  return result;
};

//get message by id
const getMessageById = (id) => {
  const result = Message.findById(id);
  if (!result) {
    throw new AppError("message not found");
  }
  return result;
};

//update message
const updateMessage = (id, payload) => {
  const result = Message.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError("message not found");
  }
  return result;
};

//delete message
const deleteMessage = (id) => {
  const result = Message.findByIdAndDelete(id);
  if (!result) {
    throw new AppError("message not found");
  }
  return result;
};

export const messageService = {
  createMessage,
  getMessageByChatId,
  getMessageById,
  updateMessage,
  deleteMessage,
};
