const express = require("express");
const searchLinks = require("../Config/searchLink");
const crawlWebsite = require("../Config/crawl");
const getChatResponse = require("../Config/openAI");
const router = express.Router();

const SMART_KEYWORDS = [
  "phân tích",
  "đánh giá",
  "số liệu",
  "cụ thể",
  "chi tiết",
  "đo lường",
  "tính toán",
  "chi phí",
  "thống kê",
];

function containsSmartKeyword(text) {
  return SMART_KEYWORDS.some((keyword) =>
    text.toLowerCase().includes(keyword.toLowerCase())
  );
}
let chatHistory = [];

router.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res
      .status(400)
      .json({ success: false, error: "Thiếu prompt đầu vào" });
  }

  try {
    let finalPrompt = "";
    let usedSources = [];

    if (containsSmartKeyword(prompt)) {
      const links = await searchLinks(prompt);
      if (!links.length) {
        return res
          .status(404)
          .json({ success: false, error: "Không tìm thấy nguồn phù hợp" });
      }

      const contents = await Promise.all(links.map(crawlWebsite));
      const mergedText = contents.join("\n---\n").slice(0, 8000);

      finalPrompt = `Hãy phân tích nội dung dưới đây liên quan đến "${prompt}":\n\n${mergedText}`;
      usedSources = links;
    } else {
      finalPrompt = prompt;
    }

    chatHistory.push({ role: "user", content: prompt });

    const groqPayload = [
      ...chatHistory.slice(-20),
      { role: "user", content: finalPrompt },
    ];

    const answer = await getChatResponse(groqPayload);

    chatHistory.push({ role: "assistant", content: answer });

    res.json({
      success: true,
      answer,
      sources: usedSources,
    });
  } catch (err) {
    console.error("Lỗi /ask:", err.message);
    res.status(500).json({ success: false, error: "Lỗi server hoặc AI" });
  }
});

module.exports = router;
