/** @format */

import express from "express";
import userRouter from "../modules/User/user.route.js";
import lengthRouter from "../modules/Length/length.route.js";
import settingsRouter from "../modules/Settings/settings.route.js";
import notificationRouter from "../modules/Notification/notification.route.js";
import MessageRouter from "../modules/message/message.route.js";
import chatRouter from "../modules/chat/chat.route.js";
import blocklistRoute from "../modules/blocklist/blocklist.route.js";

const rootRouter = express.Router();

const moduleRoutes = [
  { path: "/users", router: userRouter },
  {
    path: "/length",
    router: lengthRouter,
  },
  {
    path: "/settings",
    router: settingsRouter,
  },
  {
    path: "/notification",
    router: notificationRouter,
  },
  {
    path: "/block",
    router: blocklistRoute,
  },
  {
    path: "/chats",
    router: chatRouter,
  },
  {
    path: "/messages",
    router: MessageRouter,
  },
];

moduleRoutes.forEach((route) => {
  rootRouter.use(route.path, route.router);
});

export default rootRouter;
