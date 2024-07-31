import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { lengthService } from "./length.service.js";

const getTotalUserLength = catchAsync(async (req, res) => {
  const totalUsers = await lengthService.getAllUsersLength();
  sendResponse(res, 200, true, "Total users", totalUsers);
});

export const lengthController = {
  getTotalUserLength,
};
