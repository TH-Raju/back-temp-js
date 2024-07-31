/** @format */

import logger from "../../helpers/logger.js";
import { chatService } from "../../modules/chat/chat.service.js";
import { messageService } from "../../modules/message/message.service.js";

export const handleMessageEvents = (socket, io) => {
  socket.on("add-new-message", async (data, callback) => {
    // console.log("add new message", data);
    try {
      const message = await messageService.createMessage(data);
      // console.log("message ", message);

      if (message) {
        // console.log("message", message);
        // broadcast the message to the chatroom
        // by this, if another person is Online, he will just get the message
        const chatRoom = "new-message::" + data.chat.toString();
        socket.broadcast.emit(chatRoom, message);

        //   console.log("message", message);
        //   console.log(message?.chat?.participants[0].toString());

        //update the chatlist of the both participants
        const eventName1 =
          "update-chatlist::" + message?.chat?.participants[0].toString();
        const eventName2 =
          "update-chatlist::" + message?.chat?.participants[1].toString();

        const chatListforUser1 = await chatService.getChatByParticipantId(
          { participantId: message?.chat?.participants[0] },
          { page: 1, limit: 10 }
        );
        const chatListforUser2 = await chatService.getChatByParticipantId(
          { participantId: message?.chat?.participants[1] },
          { page: 1, limit: 10 }
        );

        io.emit(eventName1, chatListforUser1);
        io.emit(eventName2, chatListforUser2);

        callback({
          status: "Success",
          message: message.message,
        });

        return;
      } else {
        return callback({
          status: "Error",
          message: "Something went wrong",
        });
      }
    } catch (error) {
      console.error("Error adding new message:", error.message);
      logger.error("Error adding new message:", error.message);

      if (typeof callback === "function") {
        callback({ status: "Error", message: error.message });
      } else {
        console.error("Callback is not a function");
        logger.error("Callback is not a function");
      }
    }
  });
};
