const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new Schema({
  userId: { type: String, required: true },
  messages: [
    {
      role: { type: String, enum: ["user", "assistant"], required: true },
      content: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("Chat", chatSchema);
