import mongoose from "mongoose";
import Settings from "./settings.model.js";

const getSettings = async () => {
  const settings = await Settings.find({});
  return settings;
};

// Function to add settings if none exist or return the existing settings
const addSettings = async (data) => {
  const existingSettings = await Settings.findOne({});
  if (existingSettings) {
    return existingSettings;
  } else {
    const result = await Settings.create(data);
    return result;
  }
};

// Function to update settings without needing an ID
const updateSettings = async (settingsBody) => {
  // Find the existing settings document
  let settings = await Settings.findOne({});

  if (settings) {
    // Update the existing settings document
    settings = await Settings.findByIdAndUpdate(settings._id, settingsBody, {
      new: true,
    });
  } else {
    // Create a new settings document if none exist
    settings = await Settings.create(settingsBody);
  }

  return settings;
};

export const settingsService = {
  addSettings,
  updateSettings,
  getSettings,
};
