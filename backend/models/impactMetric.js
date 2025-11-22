const mongoose = require("mongoose");

const impactMetricSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    username: String,
    type: {
      type: String,
      enum: [
        "tree_planted",
        "cleanup_attended",
        "petition_signed",
        "video_created",
        "challenge_joined",
        "video_shared",
      ],
      required: true,
    },
    count: {
      type: Number,
      default: 1,
    },
    description: String,
    location: String,
    videoId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ImpactMetric", impactMetricSchema);