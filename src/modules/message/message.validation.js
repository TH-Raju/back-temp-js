/** @format */

import { z } from "zod";
import { messageType } from "./message.constant.js";

const sendMessageValidateZodSchema = z.object({
  body: z.object({
    chatId: z.string({ required_error: "chatId is required" }),
    content: z.object({
      type: z.enum(messageType).default("text"),
      path: z.string().optional(),
      text: z.string().optional(),
    }),
    senderId: z.string({ required_error: "senderId is required" }),
    receiverId: z.string({ required_error: "senderId is required" }),
  }),
});

export const sendMessageValidation = {
  sendMessageValidateZodSchema,
};
