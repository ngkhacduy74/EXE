const axios = require("axios");
const env = require("dotenv");
env.config();

async function getChatResponse(messages) {
  const API_KEY = process.env.OPENAI_API_KEY;
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: messages,
        max_tokens: 2048,
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
    console.error("Lỗi Groq:", err.response?.data || err.message);
    throw new Error("Gọi Groq thất bại.");
  }
}

module.exports = getChatResponse;
