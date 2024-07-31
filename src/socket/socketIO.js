import config from "../config/index.js";
import logger from "../helpers/logger.js";
import jwt from "jsonwebtoken";
import { handleChatEvents } from "./events/chatEvents.js";
import { handleMessageEvents } from "./events/messageEvents.js";
import { handleRoomEvents } from "./events/roomEvents.js";

const socketIO = (io) => {
  //initialize an object to store the active users
  let activeUsers = {};

  io.use((socket, next) => {
    const token = socket.handshake.headers.authorization;
    if (!token) {
      return next(new Error("Authentication error: Token not provided."));
    }

    // Extract the token from the Authorization header
    const tokenParts = token.split(" ");
    const tokenValue = tokenParts[1];
    // console.log(tokenValue);
    // console.log(config.jwt_access_token);

    // Verify the token
    jwt.verify(tokenValue, config.jwt_access_token, (err, decoded) => {
      if (err) {
        console.error(err);
        logger.error(err, "❗socket.io authentication error ❗");
        return next(new Error("Authentication error: Invalid token."));
      }
      socket.decodedToken = decoded;
      next();
    });
  });

  io.on("connection", (socket) => {
    //add the user to the active users list
    try {
      if (!activeUsers[socket?.decodedToken?.id]) {
        activeUsers[socket?.decodedToken?.id] = {
          ...socket?.decodedToken,
          id: socket?.decodedToken?.id,
        };
        console.log(`User Id: ${socket?.decodedToken?.id} is just connected.`);
      } else {
        console.log(
          `User Id: ${socket?.decodedToken?.id} is already connected.`
        );
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      logger.error(error, "-- socket.io connection error --");
    }

    // handleRoomEvents(socket);
    handleChatEvents(socket);
    handleMessageEvents(socket, io);

    //get active users
    socket.on("get-active-users", (data, callback) => {
      callback({ status: "Success", data: Object.values(activeUsers) });
    });

    //call this to show is typing
    socket.on("typing", function (data) {
      const roomId = data.chatId.toString();
      const message = socket?.decodedToken?.fullName + " is typing...";
      socket.broadcast.emit(roomId, { message: message });
    });

    socket.on("disconnect", () => {
      console.log(`User ID: ${socket?.decodedToken?.id} just disconnected`);
    });
  });
};
export default socketIO;
