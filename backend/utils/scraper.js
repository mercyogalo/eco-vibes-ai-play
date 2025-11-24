const axios = require("axios");
const cheerio = require("cheerio");

const pages = [
  "https://nema.go.ke/category/enforcement/",
  "https://new.kenyalaw.org/bills/",
  "https://nation.africa/environment",
  "https://www.standardmedia.co.ke/environment",
  "https://nema.go.ke/laws-and-guidelines/emca-regulations-review-2023/",
  "https://new.kenyalaw.org/judgments/court-class/environment-and-land-tribunals/",
  "https://new.kenyalaw.org/gazettes/2025",
  "https://kijaniresilience.org/2025/02/19/preserving-kenyas-hidden-gem-the-story-of-oloolua-forest/"
];

async function scrapeSingle(url) {
  try {
    const html = await axios.get(url).then(r => r.data);
    const $ = cheerio.load(html);
    const policies = [];

    $("a").each((_, el) => {
      let title = $(el).text().trim();
      let link = $(el).attr("href");
      if (!title || !link || title.length < 5) return;
      if (!link.startsWith("http")) link = new URL(link, url).href;

    
      let dateText = $(el).parent().find("time").attr("datetime") || $(el).parent().find("time").text();
      let date = dateText ? new Date(dateText) : null;

      policies.push({ title, link, source: url, date });
    });

    return policies;
  } catch (err) {
    console.error("Scrape error:", err.message);
    return [];
  }
}

module.exports = async function scrapePolicies() {
  let all = [];
  for (const page of pages) {
    const policies = await scrapeSingle(page);
    all.push(...policies);
  }
  return all;
};
