const axios = require("axios");
const cheerio = require("cheerio");

async function crawlWebsite(url) {
  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(res.data);
    const text = $("body").text().replace(/\s+/g, " ").trim();
    return `Nguồn: ${url}\n${text.slice(0, 5000)}`;
  } catch (err) {
    console.error("Lỗi crawl", url, err.message);
    return "";
  }
}

module.exports = crawlWebsite;
