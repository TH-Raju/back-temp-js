import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { notificationService } from "./notification.service.js";

const addNotifications = catchAsync(async (req, res) => {
  const notificationData = { ...req.body };
  //   console.log(notificationData);
  const notification = await notificationService.addNotification(
    notificationData
  );
  if (notification) {
    sendResponse(
      res,
      200,
      true,
      "Successfully added notification",
      notification
    );
  } else {
    sendResponse(res, 400, false, "Failed to add notification", {});
  }
});

const getAllNotifications = catchAsync(async (req, res) => {
  const notifications = await notificationService.getAllNotification();
  if (notifications) {
    sendResponse(
      res,
      200,
      true,
      "Successfully fetched notifications",
      notifications
    );
  } else {
    sendResponse(res, 400, false, "Failed to fetch notifications", {});
  }
});

const getSingleUserNotification = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const notifications = await notificationService.getUserNotification(userId);
  if (notifications) {
    sendResponse(
      res,
      200,
      true,
      "Successfully fetched notifications",
      notifications
    );
  } else {
    sendResponse(res, 400, false, "Failed to fetch notifications", {});
  }
});

const markNotificationsAsRead = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const result = await notificationService.markNotificationsAsRead(userId);
  if (!result) {
    return sendResponse(
      res,
      404,
      false,
      "No notifications found for this user or invalid user ID"
    );
  }

  sendResponse(res, 200, true, "Notifications marked as read", result);
});

export const notificationController = {
  addNotifications,
  getAllNotifications,
  getSingleUserNotification,
  markNotificationsAsRead,
};
