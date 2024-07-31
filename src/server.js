/** @format */

import mongoose from "mongoose";
import { createServer } from "http";
import app from "./app.js";
import config from "./config/index.js";
import color from "colors";
import logger from "./helpers/logger.js";
import { Server } from "socket.io";
import socketIO from "./socket/socketIO.js";

let server;

const socketServer = createServer();

// Initialize Socket.io with the new server instance
const io = new Server(socketServer, {
  cors: {
    origin: "*",
  },
  reconnection: true,
  reconnectionAttempts: 2,
  reconnectionDelay: 1000,
});

async function main() {
  try {
    await mongoose.connect(config.DB_URL);
    // server = app.listen(config?.port || 2000, config?.ip, () => {
    server = app.listen(config?.port || 2000, () => {
      console.log(
        `🪐 The App is listening on port ::: ${config.port}`.green.underline
          .bold
      );
    });

    socketServer.listen(config?.socket_io?.socket_port || 6000);
    console.log(
      `📡 Socket is listening on port ::: ${
        config?.socket_io?.socket_port || 6000
      }🔌`.red.underline.bold
    );
    socketIO(io);
    global.io = io;
  } catch (err) {
    console.log("🏴‍☠️Failed to connect".red.underline, err);
  }
}

main();

process.on("unhandledRejection", (err) => {
  console.log(
    `❗ unhandledRejection is detected 🏴‍☠️, shutting down ...`.red.underline
      .bold,
    err
  );

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGINT", (err) => {
  console.log("Received SIGINT. Shutting down gracefully...");
  logger.error(err, "--- server.js: SIGINT ---");
  logResponseTimes(responseTimes);
  if (server) {
    server.close(() => {
      console.log("Server closed. Exiting process.");
      process.exit(1);
    });
  }
});

process.on("uncaughtException", (err) => {
  console.log(
    `❗ uncaughtException is detected❗ , shutting down ...`.red.underline.bold,
    err
  );
  process.exit(1);
});
