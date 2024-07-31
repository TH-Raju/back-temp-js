/** @format */
import mongoose from "mongoose";
import httpStatus from "http-status";
import Chat from "./chat.model.js";
import AppError from "../../errors/AppError.js";
import Message from "../message/message.model.js";

const createChat = async (user, participants) => {
  // console.log({ user, participants });
  const alreadyExists = await Chat.findOne({
    participants: { $all: participants },
  }).populate(["participants"]);
  if (alreadyExists) {
    return alreadyExists;
  }

  const result = Chat.create({
    participants: [user, participants],
  });
  if (!result) {
    throw new AppError("chat creation failed");
  }
  return result;
};

//get my chat list
const getMyChatList = async (userId) => {
  const chats = await Chat.find({
    participants: { $all: userId },
  }).populate({
    path: "participants",
    select: "fullName email role _id phone",
    match: { _id: { $ne: userId } },
  });

  if (!chats) {
    throw new AppError(httpStatus.BAD_REQUEST, "chat list not found");
  }

  const data = [];
  for (const chatItem of chats) {
    const chatId = chatItem._id;

    // Find the latest message in the chat
    const message = await Message.findOne({ chatId: chatId }).sort({
      updatedAt: -1,
    });

    const unreadMessageCount = await Message.countDocuments({
      chatId: chatId,
      readd: false,
      senderId: { $ne: chatId },
    });
    if (message) {
      data.push({ chat: chatItem, message: message, unreadMessageCount });
    }
  }
  // console.log(data);
  data.sort((a, b) => {
    const dateA = (a.message && a.message.createdAt) || 0;
    const dateB = (b.message && b.message.createdAt) || 0;
    return dateB - dateA;
  });

  return data;
};

const getChatByParticipants = async (user, participant) => {
  let chat = await Chat.findOne({
    participants: { $in: [user, participant] },
  });

  //let isBlocked = false;
  // const blockedChats = await getBlockedListByUsersId(user, participant);
  // if (blockedChats) {
  //   isBlocked = true;
  // }
  return chat;
};

//get chat using _id
const getChatById = async (id) => {
  const result = await Chat.findById(id).populate({
    path: "participants",
    select: "fullName email role _id phone",
  });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "chat not found");
  }
  return result;
};

const getChatByParticipantId = async (filters, options) => {
  try {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const skip = (page - 1) * limit;

    const participantId = new mongoose.Types.ObjectId(filters.participantId);
    const name = filters.name ? filters.name : "";

    const allChatLists = await Chat.aggregate([
      { $match: { participants: participantId } },
      {
        $lookup: {
          from: "messages",
          let: { chatId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$chat", "$$chatId"] } } },
            { $sort: { createdAt: -1 } }, // Sort messages in descending order by createdAt
            { $limit: 1 },
            { $project: { message: 1, createdAt: 1 } }, // Project only the content and createdAt of the latest message
          ],
          as: "latestMessage",
        },
      },
      { $unwind: { path: "$latestMessage", preserveNullAndEmptyArrays: true } },
      { $sort: { "latestMessage.createdAt": -1 } }, // Sort chat list based on the createdAt of the latest message
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          as: "participants",
        },
      },
      {
        $addFields: {
          participants: {
            $map: {
              input: {
                $filter: {
                  input: "$participants",
                  as: "participant",
                  cond: { $ne: ["$$participant._id", participantId] },
                },
              },
              as: "participant",
              in: {
                _id: "$$participant._id",
                fullName: "$$participant.fullName",
                image: "$$participant.image",
              },
            },
          },
        },
      },
      {
        $match: {
          participants: {
            $elemMatch: {
              fullName: { $regex: name },
            },
          },
        },
      },
      {
        $addFields: {
          participant: {
            $arrayElemAt: ["$participants", 0],
          },
        },
      },
      {
        $project: {
          latestMessage: 1,
          groupName: 1,
          type: 1,
          groupAdmin: 1,
          image: 1,
          participant: 1,
        },
      },
      {
        $facet: {
          totalCount: [{ $count: "count" }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);

    const totalResults =
      allChatLists[0].totalCount.length > 0
        ? allChatLists[0].totalCount[0].count
        : 0;
    const totalPages = Math.ceil(totalResults / limit);
    const pagination = { totalResults, totalPages, currentPage: page, limit };

    return { chatList: allChatLists[0]?.data, pagination };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//update chatList
const updateChatList = async (id, payload) => {
  const result = await Chat.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "chat not found");
  }
  return result;
};

//delete chatList
const deleteChatList = async (id) => {
  const result = await Chat.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "chat not found");
  }
  return result;
};

export const chatService = {
  createChat,
  getMyChatList,
  getChatByParticipants,
  getChatByParticipantId,
  getChatById,
  updateChatList,
  deleteChatList,
};
