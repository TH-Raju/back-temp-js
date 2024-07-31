import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const chatSchema = new Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
    status: {
      type: String,
      enum: ["accepted", "blocked"],
      default: "accepted",
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model is already defined to avoid OverwriteModelError
const Chat = models.Chat || model("Chat", chatSchema);

export default Chat;
