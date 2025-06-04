const axios = require("axios");
const env = require("dotenv");
async function getChatResponse(prompt) {
  const API_KEY = process.env.OPENAI_API_KEY;
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 5000,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (err) {
    console.error("Lỗi OpenAI:", err.response?.data || err.message);
    throw new Error("Gọi Groq thất bại.");
  }
}

module.exports = getChatResponse;
