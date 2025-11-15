const express = require("express");
const router = express.Router();
const Chat = require("../models/chat"); // your chat model
const generateOpenRouterResponse = require("../utils/openrouter.js");


router.post("/chat", async (req, res) => {
  const { query, userId } = req.body;

  if (!query) return res.status(400).json({ message: "Query required" });
  if (!userId) return res.status(400).json({ message: "UserId required" });

  try {
  
    let chat = await Chat.findOne({ userId });

    if (!chat) {
      chat = await Chat.create({
        userId,
        messages: [],
      });
    }

  
    chat.messages.push({
      role: "user",
      content: query,
    });

    
    const safeHistory = chat.messages.filter(
      (msg) => msg.role === "user" || msg.role === "assistant"
    );

  
    const aiReply = await generateOpenRouterResponse(query, safeHistory);

   
    chat.messages.push({
      role: "assistant",
      content: aiReply,
    });

    await chat.save();

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ message: "AI response failed", error: error.message });
  }
});

module.exports = router;
