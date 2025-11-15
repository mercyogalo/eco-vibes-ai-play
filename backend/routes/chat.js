
const express = require("express");
const router = express.Router();
const generateOpenRouterResponse=require("../utils/openrouter.js");



router.post("/chat", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ message: "Query required" });
    
  try {
    const response = await generateOpenRouterResponse(query);
    res.json({reply:response});
  } catch (error) {
    res.status(500).json({ message: "AI response failed", error: error.message });
  }
});






module.exports = router;
