const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = async function generateVideo(summary, title) {
  const folder = path.join(__dirname, "../uploads/videos");
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

  const apiKey = process.env.HUGGINGFACE_API_KEY;

  const res = await axios.post(
    "https://api.huggingface.co/models/huggingface-projects/text-to-video",
    { inputs: summary },
    {
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      responseType: "arraybuffer"
    }
  );

  const fileName = `${Date.now()}-${title.replace(/\s+/g, "_")}.mp4`;
  const filePath = path.join(folder, fileName);

  fs.writeFileSync(filePath, res.data);

  return `/uploads/videos/${fileName}`;
};
