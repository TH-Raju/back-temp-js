/** @format */

import { chatService } from "../../modules/chat/chat.service.js";
import logger from "../../helpers/logger.js";

export const handleRoomEvents = (socket) => {
  socket.on("join-room", async (data, callback) => {
    try {
      const chatId = data.chatId;
      const chat = await chatService.getChatById(chatId);
      if (!chat) {
        return callback({ status: "Error", message: "Chat not found" });
      }
      const userExists = chat.participants.some(
        (participant) => participant.id.toString() === socket.decodedToken.id
      );

      if (!userExists) {
        return callback({
          status: "Error",
          message: "User not authorized to join this chat",
        });
      }
      const roomId = "vide-con-XX056-965125-room::" + chatId.toString();
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", socket.decodedToken);
      return callback({
        status: "Success",
        message: "Joined room successfully",
      });
    } catch (error) {
      console.error("Error joining room:", error.message);
      logger.error("Error joining room:", error.message);
      return callback({ status: "Error", message: error.message });
    }
  });
};
