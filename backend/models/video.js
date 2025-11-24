const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    size: Number,
    path: String,
    thumbnail: String,
    duration: {
      type: Number,
      default: 15,
    },
    userId: {
      type: String,
      required: true,
    },
    username: String,
    category: {
      type: String,
      enum: [
        "deforestation",
        "pollution",
        "land-grabbing",
        "challenge",
        "education",
      ],
    },
    hashtags: [String],
    template: String,
    effects: [String],
    music: String,
    caption: String,
    status: {
      type: String,
      enum: ["processing", "ready", "published"],
      default: "ready",
    },
    sharedOn: [
      {
        type: String,
        enum: ["tiktok", "instagram", "youtube", "twitter"],
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    location: String,
    county: String,
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
}, 
    videoUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    publishedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);