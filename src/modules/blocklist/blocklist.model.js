/** @format */

import mongoose, { Schema, model } from "mongoose";

const blockListSchema = Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const BlockList = model("BlockList", blockListSchema);

export default BlockList;
