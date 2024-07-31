/** @format */

import { User } from "../User/user.model.js";
import Chat from "../chat/chat.model.js";
import Message from "../message/message.model.js";
import BlockList from "./blocklist.model.js";
import ApiError from "../../errors/AppError.js";
import httpStatus from "http-status";

//block a user
const blockedThisProfile = async (payload) => {
  const user = await User.findById(payload.profileId);

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "user not found");
  }
  const alreadyBlockedBlockedA = await BlockList.findOne({
    profileId: payload?.profileId,
    userId: payload?.userId,
  });

  const alreadyBlockedBlockedB = await BlockList.findOne({
    profileId: payload?.userId,
    userId: payload?.profileId,
  });

  //  const matchRequest  = await
  if (alreadyBlockedBlockedA) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "you are already blocked this profile"
    );
  }

  if (alreadyBlockedBlockedB) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "this profile is already blocked by you"
    );
  }
  const chatList = await Chat.findOne({
    participants: { $all: [payload?.profileId, payload?.userId] },
  });
  if (chatList) {
    await Message.deleteMany({ chatId: chatList._id });
  }

  // const chatList = await Chat.findOneAndUpdate(
  //   { participants: { $all: [sender_id, receiver_id] } },
  //   { $set: { status: "blocked" } }
  // );
  // if (chatList) {
  //   await Message.deleteMany({ chatId: chatList._id });
  // }

  const result = await BlockList.create(payload);
  return result;
};

//get my block list
const getMyBlockList = async (userId) => {
  const result = await BlockList.find({ userId: userId });
  return result;
};

//unblock a user
const unBlockProfile = async ({ userId, profileId }) => {
  const result = await BlockList.deleteOne({
    $and: [{ userId: userId }, { profileId: profileId }],
  });
  // console.log(result)
  // await Chat.updateMany({participants:{$all: [sender_id, receiver_id]}},{$set: {status: 'blocked'}});
  return result;
};

export const blockListService = {
  blockedThisProfile,
  getMyBlockList,
  unBlockProfile,
};
