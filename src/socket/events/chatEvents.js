/** @format */

import logger from "../../helpers/logger.js";
import { chatService } from "../../modules/chat/chat.service.js";

export const handleChatEvents = (socket) => {
  socket.on("add-new-chat", async (data, callback) => {
    // console.log("first ", data);
    try {
      let chat = {};
      if (data.participant) {
        const existingChat = await chatService.getChatByParticipants(
          socket.decodedToken.id,
          data.participant
        );
        if (existingChat && existingChat.status === "accepted") {
          callback({
            status: "Success",
            chatId: existingChat._id,
            message: "Chat already exists",
          });
          return;
        }

        chat = await chatService.createChat(
          socket.decodedToken.id,
          data.participant
        );
        //   console.log("chat ", chat);
        callback({
          status: "Success",
          chatId: chat._id,
          message: "Chat created successfully",
        });
      } else {
        callback({
          status: "Error",
          message: "Must provide at least 2 participants",
        });
      }
    } catch (error) {
      console.error("Error adding new chat:", error.message);
      logger.error("Error adding new chat:", error.message);
      callback({ status: "Error", message: error.message });
    }
  });
};
