import express from "express";
import { notificationController } from "./notification.controller.js";

const notificationRouter = express.Router();

notificationRouter
  .get("/", notificationController.getAllNotifications)
  .get("/:userId", notificationController.getSingleUserNotification)
  .post("/add", notificationController.addNotifications)
  .put("/mark-read/:userId", notificationController.markNotificationsAsRead);

export default notificationRouter;
