const axios = require("axios");
const ChatService = require("../Config/chatService");

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
      return res.status(400).json({
        success: false,
        message: "Câu hỏi không được để trống",
      });
    }

    // Lưu user prompt vào history
    chatServiceInstance.addToHistory('user', prompt);

    // 1) Xử lý nội bộ bằng ChatService
    const serviceResp = await chatServiceInstance.processQuestion(prompt);

    // Nếu ChatService trả về đáp án chuyên biệt (không phải general_help)
    if (serviceResp && serviceResp.type && serviceResp.type !== "general_help") {
      chatServiceInstance.addToHistory('assistant', serviceResp.answer);
      return res.status(200).json({ success: true, ...serviceResp });
    }

    // Nếu ChatService gợi ý danh sách sản phẩm → đưa vào ngữ cảnh
    let finalPrompt = prompt;
    if (serviceResp && Array.isArray(serviceResp.products) && serviceResp.products.length) {
      const intro = `Dưới đây là danh sách sản phẩm (JSON). Hãy: \n1. Chọn ra 1 sản phẩm phù hợp nhất với câu hỏi của khách.\n2. Trả lời trọng tâm, chi tiết về sản phẩm đó (nhấn mạnh thông số, lợi ích, giá).\n3. Viết bằng tiếng Việt, giọng tư vấn bán hàng Vinsaky.\n\nPRODUCT_LIST_JSON:\n${JSON.stringify(serviceResp.products)}`;
      finalPrompt = `${intro}\n\nCâu hỏi của khách: ${prompt}`;
    }

    // 2) Chuẩn bị messages cho AI
    // Lấy toàn bộ lịch sử, nếu dài sẽ tóm tắt để tiết kiệm token
    const fullHistory = chatServiceInstance.getHistoryMessages(100);
    let summaryMessage = null;
    let recentMessages = fullHistory;
    if (fullHistory.length > 20) {
      const older = fullHistory.slice(0, -10); // tóm tắt phần cũ
      let summaryText = older.map(m => (m.role === 'user' ? `Khách: ${m.content}` : `AI: ${m.content}`)).join(' ');
      if (summaryText.length > 400) {
        summaryText = summaryText.slice(-400); // giữ 400 ký tự cuối cùng để vẫn gần ngữ cảnh hiện tại
      }
      summaryMessage = { role: 'system', content: `TÓM TẮT CUỘC TRÒ CHUYỆN TRƯỚC: ${summaryText}` };
      recentMessages = fullHistory.slice(-10);
    }
    const historyMessages = recentMessages;
    const systemMessage = {
      role: 'system',
      content: process.env.BUSINESS_KNOWLEDGE || 'Bạn là trợ lý AI của Vinsaky'
    };

    let messages = [systemMessage];
    if (summaryMessage) messages.push(summaryMessage);
    messages = [...messages, ...historyMessages];
    if (serviceResp && Array.isArray(serviceResp.products) && serviceResp.products.length) {
      const slimProducts = serviceResp.products.map(p => ({ id: p.id, name: p.name, price: p.price, brand: p.brand }));
      messages.push({ role: 'system', content: `PRODUCT_LIST_JSON:\n${JSON.stringify(slimProducts)}` });
    }
    // Luôn thêm prompt cuối cùng của người dùng (đã chèn intro nếu có) để model trả lời đúng ngữ cảnh
    messages.push({ role: 'user', content: finalPrompt });

    // 3) Gọi Groq AI
    const aiAnswer = await callGroqAI(messages);
    chatServiceInstance.addToHistory('assistant', aiAnswer);

    const responsePayload = { success: true, answer: aiAnswer, raw: aiAnswer };
    if (serviceResp && Array.isArray(serviceResp.products) && serviceResp.products.length) {
      responsePayload.products = serviceResp.products;
    }
    return res.status(200).json(responsePayload);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Đã xảy ra lỗi khi xử lý câu hỏi",
    });
  }
};

module.exports = { askQuestion };
