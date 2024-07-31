/** @format */

import mongoose from "mongoose";
import Notification from "./notification.model.js";

const addNotification = async (data) => {
  const result = await Notification.create(data);
  return result;
};

const getAllNotification = async () => {
  const result = await Notification.find({});
  return result;
};

const getUserNotification = async (userId) => {
  const isValidUserId = mongoose.Types.ObjectId.isValid(userId);
  if (!isValidUserId) {
    return null;
  }
  try {
    const notifications = await Notification.find({ userId });

    if (notifications.length > 50) {
      const notificationsToDelete = notifications
        .sort((a, b) => a.createdAt - b.createdAt)
        .slice(0, notifications.length - 50);

      // Delete the excess notifications
      const deletePromises = notificationsToDelete.map((notification) =>
        Notification.findByIdAndDelete(notification._id)
      );
      await Promise.all(deletePromises);
    }

    // Retrieve the remaining notifications in reverse order
    const remainingNotifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });
    return remainingNotifications;
  } catch (error) {
    console.error("Error while finding user notification:", error);
    throw error;
  }
};

const markNotificationsAsRead = async (userId) => {
  const isValidUserId = mongoose.Types.ObjectId.isValid(userId);
  if (!isValidUserId) {
    return null;
  }
  try {
    const result = await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );
    return result;
  } catch (error) {
    console.error("Error while marking notifications as read:", error);
    throw error;
  }
};

export const notificationService = {
  addNotification,
  getAllNotification,
  getUserNotification,
  markNotificationsAsRead,
};
