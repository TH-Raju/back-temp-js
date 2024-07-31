import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { settingsService } from "./settings.service.js";

const addSetting = catchAsync(async (req, res) => {
  const settingData = { ...req.body };
  const setting = await settingsService.addSettings(settingData);
  if (setting) {
    sendResponse(res, 200, true, "Setting added successfully", setting);
  } else {
    sendResponse(res, 400, false, "Failed to add setting", {});
  }
});

const getAllSettings = catchAsync(async (req, res) => {
  const settings = await settingsService.getSettings();
  if (settings) {
    sendResponse(res, 200, true, "Settings Found", settings);
  } else {
    sendResponse(res, 404, false, "No settings found", {});
  }
});

const updateSetting = catchAsync(async (req, res) => {
  //   const { id } = req.params;
  const settingData = { ...req.body };
  const setting = await settingsService.updateSettings(settingData);
  if (setting) {
    sendResponse(res, 200, true, "Setting Update successfully", setting);
  } else {
    sendResponse(res, 404, false, "Something went wrong", {});
  }
});

export const settingsController = {
  addSetting,
  updateSetting,
  getAllSettings,
};
