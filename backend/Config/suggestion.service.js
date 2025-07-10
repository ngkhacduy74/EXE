const axios = require("axios");
const stringSimilarity = require('string-similarity');
const deviceCatalog = require('./deviceCatalog');

function suggestDevicesByIntent(userQuestion, topN = 3) {
  const results = deviceCatalog.map(device => ({
    name: device.name,
    score: stringSimilarity.compareTwoStrings(userQuestion.toLowerCase(), device.description.toLowerCase())
  }));
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, topN).map(r => r.name);
}

async function suggestDevicesByLlama3(userQuestion) {
  const catalogText = deviceCatalog.map(
    (d, i) => `${i + 1}. ${d.name}: ${d.description}`
  ).join("\n");

  const prompt = `Bạn là chuyên gia tư vấn thiết bị cho kinh doanh thực phẩm.\nChỉ được phép chọn thiết bị từ danh sách sau (không được nghĩ thêm):\n${catalogText}\n\nCâu hỏi: ${userQuestion}\nChỉ trả lời bằng tên thiết bị phù hợp, phân tách bằng dấu phẩy. Không giải thích, không nêu giá, không trình bày dài dòng.`;

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: "Bạn là chuyên gia tư vấn thiết bị cho kinh doanh thực phẩm." },
        { role: "user", content: prompt }
      ],
      max_tokens: 200,
      temperature: 0.1
    },
    {
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY || "YOUR_GROQ_API_KEY"}`,
        "Content-Type": "application/json"
      }
    }
  );

  const text = response.data.choices[0].message.content;
  const validNames = deviceCatalog.map(d => d.name.toLowerCase());
  const devices = text.split(",")
    .map(s => s.trim())
    .filter(name => validNames.includes(name.toLowerCase()));
  return devices;
}

function suggestDevicesByKeyword(userQuestion) {
  const normalizedQ = normalizeText(userQuestion);
  const matchedDevices = deviceCatalog.filter(device =>
    device.keywords && device.keywords.some(keyword =>
      normalizedQ.includes(normalizeText(keyword))
    )
  );
  return matchedDevices;
}
const normalizeText = (text) =>
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();



async function suggestDevicesForBusinessSmart(userQuestion, useAI) {
  // Ưu tiên lọc từ khóa trước
  const keywordMatches = suggestDevicesByKeyword(userQuestion);
  if (keywordMatches.length > 0) {
    return keywordMatches;
  }
  // Nếu không có, fallback sang AI hoặc similarity
  if (useAI) {
    return await suggestDevicesByLlama3(userQuestion);
  } else {
    return suggestDevicesByIntent(userQuestion);
  }
}

async function suggestDeviceByAIIntent(userQuestion) {
  const deviceNames = deviceCatalog.map(d => d.name).join(", ");
  const prompt = `Dựa vào câu hỏi của người dùng, hãy xác định ý định của họ và chọn MỘT loại thiết bị phù hợp nhất từ danh sách sau. Trả lời CHỈ bằng tên thiết bị đó, không thêm bất cứ thứ gì khác.\n\nDANH SÁCH THIẾT BỊ: [${deviceNames}]\n\nCâu hỏi: "${userQuestion}"\n\nThiết bị phù hợp nhất là:`;

  try {
    const response = await axios.post(
      `${process.env.OPENAI_BASE_URL}/chat/completions`,
      {
        model: process.env.MODEL_NAME || "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        max_tokens: 50,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiResponse = response.data.choices?.[0]?.message?.content?.trim();
    if (!aiResponse) return null;

    // Find the device in the catalog to ensure the AI didn't hallucinate
    const foundDevice = deviceCatalog.find(d => aiResponse.includes(d.name));
    
    return foundDevice || null; // Return the full device object or null

  } catch (error) {
    console.error("Error in suggestDeviceByAIIntent:", error.message);
    return null;
  }
}

module.exports = { suggestDevicesByIntent, suggestDevicesByLlama3, suggestDevicesByKeyword, suggestDevicesForBusinessSmart, suggestDeviceByAIIntent };