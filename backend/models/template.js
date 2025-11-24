const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema(
  {
    name: {
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
    duration: Number,
    style: String,
    effects: [String],
    hashtags: [String],
    thumbnail: String,
    description: String,
    script: String,
    musicSuggestion: String,
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Template", templateSchema);
