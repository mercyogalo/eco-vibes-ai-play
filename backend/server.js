const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const chatRoute = require("./routes/chat");
const mongoose = require("mongoose");
const scrapeRoutes = require("./routes/scrapeRoutes");
const policyRoutes = require("./routes/policyRoutes");
const videoRoutes = require("./routes/videoRoutes"); 
const cron = require("node-cron");
const runScraper = require("./utils/scrape-auto");

const app = express();

dotenv.config();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); 


app.use("/api", chatRoute);
app.use("/api/scrape", scrapeRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/videos", videoRoutes); 


app.get("/", (req, res) => {
  res.json({
    status: " Backend is alive!",
    message: "EcoPulse Server Running",
    endpoints: {
      chat: "/api/chat",
      scrape: "/api/scrape",
      policies: "/api/policies",
      videos: "/api/videos",
    },
  });
});


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.log(" MongoDB error:", err));


cron.schedule("0 */2 * * *", () => {
  console.log("Running auto-scraper...");
  runScraper();
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  EcoPulse Backend Started
  Port: ${PORT}                   
  `);
});
