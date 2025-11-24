const mongoose = require("mongoose");

const tiktokAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    tiktokOpenId: {
      type: String,
      required: true,
    },
    tiktokUnionId: String,
    username: String,
    displayName: String,
    avatarUrl: String,
    isVerified: Boolean,
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    expiresAt: Date,
    isConnected: {
      type: Boolean,
      default: true,
    },
    connectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TikTokAccount", tiktokAccountSchema);
