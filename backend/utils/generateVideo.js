const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const axios = require("axios");
const gTTS = require("gtts");


async function generateImage(prompt, index, folder) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  const res = await axios.post(
    "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
    { inputs: prompt },
    {
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      responseType: "arraybuffer"
    }
  );
  const imgPath = path.join(folder, `slide${index + 1}.png`);
  fs.writeFileSync(imgPath, res.data);
  return imgPath;
}

function splitSummary(summary, parts = 5) {
  const words = summary.split(" ");
  const chunkSize = Math.ceil(words.length / parts);
  const chunks = [];
  for (let i = 0; i < parts; i++) {
    chunks.push(words.slice(i * chunkSize, (i + 1) * chunkSize).join(" "));
  }
  return chunks;
}

module.exports = async function generateVideo(summary, title) {
  const folder = path.join(__dirname, "../uploads/videos");
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

  const fileName = `${Date.now()}-${title.replace(/\s+/g, "_")}.mp4`;
  const filePath = path.join(folder, fileName);

  
  const images = [];
  for (let i = 0; i < 5; i++) {
    const img = await generateImage(summary, i, folder);
    images.push(img);
  }

 
  const ttsPath = path.join(folder, "narration.mp3");
  const tts = new gTTS(summary, "en");
  await new Promise((res, rej) =>
    tts.save(ttsPath, (err) => (err ? rej(err) : res()))
  );

  
  const getDurationCmd = `ffprobe -i ${ttsPath} -show_entries format=duration -v quiet -of csv="p=0"`;
  const audioDuration = parseFloat(execSync(getDurationCmd).toString().trim());

  
  const slideDuration = audioDuration / images.length;

  
  const captions = splitSummary(summary, images.length);

  
  const inputs = images.map(img => `-loop 1 -t ${slideDuration} -i ${img}`).join(" ");
  const captionFilters = images
    .map((_, i) => `[${i}:v]fade=t=in:st=0:d=1,fade=t=out:st=${slideDuration-1}:d=1,drawtext=text='${captions[i]}':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=h-80:box=1:boxcolor=black@0.5:boxborderw=5[v${i}]`)
    .join(";");

  const filterComplex = `${captionFilters};` + images.map((_, i) => `[v${i}]`).join('') + `concat=n=${images.length}:v=1:a=0,format=yuv420p[v]`;

  
  const cmd = `ffmpeg -y ${inputs} -i ${ttsPath} -filter_complex "${filterComplex}" -map "[v]" -map ${images.length}:a -c:v libx264 -r 30 -pix_fmt yuv420p -shortest ${filePath}`;

  try {
    execSync(cmd);
  } catch {
    // fallback simple slideshow without fades if filter fails
    const imagePattern = path.join(folder, "slide%d.png");
    const fallbackCmd = `ffmpeg -y -framerate 1/${slideDuration} -i ${imagePattern} -i ${ttsPath} -c:v libx264 -r 30 -pix_fmt yuv420p -shortest ${filePath}`;
    execSync(fallbackCmd);
  }

  
  images.forEach(img => fs.unlinkSync(img));
  fs.unlinkSync(ttsPath);

  return `/uploads/videos/${fileName}`;
};
