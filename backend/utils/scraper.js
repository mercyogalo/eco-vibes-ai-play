const axios = require("axios");
const cheerio = require("cheerio");

const pages = [
  "https://nema.go.ke/laws-and-guidelines/gazetted-regulations/",
  "https://nema.go.ke/laws-and-guidelines/draft-regulations/",
  "https://www.nema.go.ke/media-centre/public-notices/",
  "https://landcommission.go.ke/notices/",
  "https://tenders.go.ke/"
];

function determineStatus(url, title) {
  const t = title.toLowerCase();
  if (url.includes("gazetted-regulations")) return "PASSED";
  if (url.includes("draft-regulations") || url.includes("public-notices")) return "PROPOSED";
  if (t.includes("legal notice") || t.includes("ln ") || t.includes("act no")) return "PASSED";
  if (t.includes("draft") || t.includes("proposed") || t.includes("amendment bill")) return "PROPOSED";
  return "UNKNOWN";
}

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
      const status = determineStatus(url, title);

      policies.push({
        title,
        link,
        source: url,
        date: new Date(),
        status
      });
    });

    return policies;
  } catch (e) {
    console.error("Scrape error:", e.message);
    return [];
  }
}

module.exports = async function scrapePolicies() {
  let all = [];
  for (const page of pages) {
    const results = await scrapeSingle(page);
    all = [...all, ...results];
  }
  return all;
};
