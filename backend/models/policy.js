const mongoose = require("mongoose");

const PolicySchema = new mongoose.Schema(
  {
    title: String,
    summary: String,
    source: String,
    date: Date,
    videoPath: String,
    status: { type: String, enum: ["POSITIVE", "NEGATIVE"], default: "POSITIVE" },
    progress: { type: String, enum: ["PASSED", "PROPOSED", "UNKNOWN"], default: "UNKNOWN" },
    link: { type: String, unique: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Policy", PolicySchema);
