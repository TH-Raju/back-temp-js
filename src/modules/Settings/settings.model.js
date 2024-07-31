import { Schema, model } from "mongoose";

const settingsSchema = new Schema(
  {
    privacyPolicy: {
      type: String,
    },
    aboutUs: {
      type: String,
    },
    support: {
      type: String,
    },
    termsOfService: {
      type: String,
    },
  },
  { timestamps: true }
);

const Settings = model("Settings", settingsSchema);
export default Settings;
