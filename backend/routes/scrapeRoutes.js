const express = require("express");
const router = express.Router();
const runScraper = require("../utils/scrape-auto");

router.post("/", async (req, res) => {
  try {
    await runScraper();
    res.json({ message: "Scraper executed successfully." });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
