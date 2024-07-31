/** @format */

import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { blockListService } from "./blocklist.service.js";

const blockedThisProfile = catchAsync(async (req, res) => {
  const result = await blockListService.blockedThisProfile(req.body);
  sendResponse(
    res,
    httpStatus.OK,
    true,
    "successfully blocked this profile",
    result
  );
});

//get my blockList
const getMyBlockList = catchAsync(async (req, res) => {
  const result = await blockListService.getMyBlockList(req.params.userId);
  sendResponse(
    res,
    httpStatus.OK,
    true,
    "my block list get successfully",
    result
  );
});

//unblock user
const unBlockProfile = catchAsync(async (req, res) => {
  const result = await blockListService.unBlockProfile(req.body);
  sendResponse(
    res,
    httpStatus.OK,
    true,
    "successfully unblocked this profile",
    result
  );
});

export const blocklistController = {
  blockedThisProfile,
  getMyBlockList,
  unBlockProfile,
};
