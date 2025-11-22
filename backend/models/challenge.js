const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
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
    participants: {
      type: Number,
      default: 0,
    },
    videos: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "trending", "completed"],
      default: "active",
    },
    deadline: Date,
    prize: String,
    icon: String,
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    createdBy: String,
    joinedUsers: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Challenge", challengeSchema);