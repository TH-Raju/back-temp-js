import { notificationService } from "../modules/Notification/notification.service.js";

const sendNotification = async (data, roomId) => {
  const notification = await notificationService.addNotification(data);
  if (notification) {
    io.emit(roomId, notification);
    console.log("---> Notification sent to room: ", roomId);
  }
  return true;
};

export default sendNotification;
