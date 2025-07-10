const axios = require("axios");
const ChatService = require("../Config/chatService");
const { suggestDeviceByAIIntent } = require("../Config/suggestion.service");
const { loadAllProduct, findProductsByDeviceNames } = require("./product.controller");

async function callGroqAI(messages) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const baseURL = process.env.OPENAI_BASE_URL;
    const model = process.env.MODEL_NAME;
    const businessKnowledge = process.env.BUSINESS_KNOWLEDGE || "Bạn là trợ lý AI của Vinsaky";

    if (!apiKey || !baseURL || !model) {
      throw new Error("Thiếu cấu hình API key, base URL hoặc model trong biến môi trường");
    }

    const response = await axios.post(
      `${baseURL}/chat/completions`,
      {
        model: model,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const answer = response.data.choices?.[0]?.message?.content?.trim();
    return answer || "Xin lỗi, tôi chưa có câu trả lời phù hợp.";
  } catch (error) {
    console.error("Groq API error:", error?.response?.data || error.message);
    throw new Error(
      error?.response?.data?.error?.message || "Lỗi khi gọi Groq AI"
    );
  }
}

// Khởi tạo ChatService singleton
const chatServiceInstance = new ChatService();

// ========================================
// Controller chính cho chat /chat/ask
// ========================================
const askQuestion = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, message: "Câu hỏi không được để trống" });
    }

    const userId = (req.user && (req.user.id || req.user._id)) || req.body.userId || null;
    chatServiceInstance.addToHistory(userId, 'user', prompt);

    // --- PATH A: AI-based Intent Recognition ---
    const primaryDevice = await suggestDeviceByAIIntent(prompt);

    if (primaryDevice) {
      // Nếu AI nhận diện được ý định, xử lý theo thiết bị đó
      const deviceNames = [primaryDevice.name];
      const productResult = await findProductsByDeviceNames(deviceNames);
      const foundProducts = productResult.success ? productResult.data : [];

      const primaryDeviceName = primaryDevice.name;
      const slimProducts = foundProducts.map(p => ({
        id: p.id, name: p.name, price: p.price, brand: p.brand, description: p.description
      }));

      const intro = `**YÊU CẦU BẮT BUỘC:**
1.  **Tập trung vào thiết bị chính:** Khách hàng đang hỏi về kinh doanh yêu cầu có "${primaryDeviceName}". Bạn **PHẢI** xác định đây là thiết bị quan trọng nhất và giải thích tại sao nó không thể thiếu.
2.  **Tư vấn sản phẩm cụ thể:** Dựa vào danh sách sản phẩm dưới đây (PRODUCT_LIST_JSON), hãy chọn MỘT sản phẩm "${primaryDeviceName}" phù hợp nhất để giới thiệu chi tiết.
3.  **Giọng văn:** Chuyên gia tư vấn của Vinsaky.
4.  **Độ dài:** Trả lời ngắn gọn, súc tích, trong khoảng 100-150 từ.

**DANH SÁCH SẢN PHẨM ĐỂ THAM KHẢO (PRODUCT_LIST_JSON):**
${JSON.stringify(slimProducts)}`;
      
      const finalPrompt = `${intro}\n\n**Câu hỏi của khách:** ${prompt}`;
      
      const historyMessages = chatServiceInstance.getHistoryMessages(userId, 10);
      const systemMessage = { role: 'system', content: process.env.BUSINESS_KNOWLEDGE || 'Bạn là trợ lý AI của Vinsaky' };
      const messages = [systemMessage, ...historyMessages, { role: 'user', content: finalPrompt }];

      const aiAnswer = await callGroqAI(messages);
      chatServiceInstance.addToHistory(userId, 'assistant', aiAnswer);

      return res.status(200).json({
        success: true,
        answer: aiAnswer,
        raw: aiAnswer,
        products: foundProducts
      });
    }

    // --- PATH B: General AI suggestion (No keywords found) ---
    const serviceResp = await chatServiceInstance.processQuestion(prompt);
    if (serviceResp && serviceResp.type && serviceResp.type !== "general_help") {
      chatServiceInstance.addToHistory(userId, 'assistant', serviceResp.answer);
      return res.status(200).json({ success: true, ...serviceResp });
    }

    let finalProducts = (serviceResp && Array.isArray(serviceResp.products)) ? serviceResp.products : [];
    let finalPrompt = prompt;

    if (finalProducts.length > 0) {
      const slimProducts = finalProducts.map(p => ({ id: p.id, name: p.name, price: p.price, brand: p.brand }));
      const intro = `Dưới đây là danh sách sản phẩm (JSON). Hãy chọn 1 sản phẩm phù hợp nhất để tư vấn chi tiết.\n\nPRODUCT_LIST_JSON:\n${JSON.stringify(slimProducts)}`;
      finalPrompt = `${intro}\n\nCâu hỏi của khách: ${prompt}`;
    }

    const historyMessages = chatServiceInstance.getHistoryMessages(userId, 10);
    const systemMessage = { role: 'system', content: process.env.BUSINESS_KNOWLEDGE || 'Bạn là trợ lý AI của Vinsaky' };
    const messages = [systemMessage, ...historyMessages, { role: 'user', content: finalPrompt }];

    const aiAnswer = await callGroqAI(messages);
    chatServiceInstance.addToHistory(userId, 'assistant', aiAnswer);

    return res.status(200).json({
      success: true,
      answer: aiAnswer,
      raw: aiAnswer,
      products: finalProducts
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Đã xảy ra lỗi khi xử lý câu hỏi",
    });
  }
};

module.exports = { askQuestion };
