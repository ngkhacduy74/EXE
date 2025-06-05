const express = require("express");
const searchLinks = require("../Config/searchLink");
const crawlWebsite = require("../Config/crawl");
const getChatResponse = require("../Config/openAI");
const { verifyToken } = require("../Middleware/auth.middleware");
const router = express.Router();

router.post("/ask", verifyToken, async (req, res) => {
  const { prompt } = req.body;
  console.log("kahsdad", req.body);
  if (!prompt) {
    return res
      .status(400)
      .json({ success: false, error: "Thiếu prompt đầu vào" });
  }

  try {
    const links = await searchLinks(prompt);

    if (!links.length) {
      return res
        .status(404)
        .json({ success: false, error: "Không tìm thấy nguồn phù hợp" });
    }

    const contents = await Promise.all(links.map(crawlWebsite));
    const mergedText = contents.join("\n---\n").slice(0, 8000);

    const fullPrompt = `Tóm tắt và phân tích dữ liệu dưới đây về: "${prompt}"\n\n${mergedText}`;
    const answer = await getChatResponse(fullPrompt);

    res.json({
      success: true,
      answer,
      sources: links,
    });
  } catch (err) {
    console.error("Lỗi /ask:", err.message);
    res.status(500).json({ success: false, error: "Lỗi server hoặc AI" });
  }
});

module.exports = router;
