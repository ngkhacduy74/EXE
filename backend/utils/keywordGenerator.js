const { groq } = require('../Config/groqConfig');

/**
 * Sinh từ khóa thiết bị sát nhất cho mô hình kinh doanh hoặc sản phẩm cụ thể
 * @param {string} query - Câu hỏi của người dùng
 * @param {string} context - Ngữ cảnh (không bắt buộc)
 * @param {number} numKeywords - Số lượng từ khóa mong muốn (mặc định 10)
 * @returns {Promise<string[]>}
 */
async function generateKeywordsWithGroq(query, context = '', numKeywords = 10) {
  try {
    const systemPrompt = `Bạn là chuyên gia thiết bị ngành F&B.\nDù người dùng hỏi về mô hình kinh doanh hay sản phẩm cụ thể (ví dụ: kinh doanh cơm tấm, bán bánh mì, mở quán chè...),\nhãy luôn trả về đúng ${numKeywords} từ khóa thiết bị, máy móc, vật dụng liên quan nhất để phục vụ mô hình/sản phẩm đó.\nNếu là mô hình cơm, cơm tấm, quán cơm, hãy ưu tiên sinh ra từ khóa như tủ cơm, tủ nấu cơm, nồi cơm, bếp, tủ hấp, bàn inox, tủ lạnh, máy xay.\nNếu là mô hình cafe, cà phê, quán cafe, quán cà phê, hãy ưu tiên sinh ra từ khóa như máy pha cà phê, máy làm đá viên, tủ mát, tủ lạnh, máy xay sinh tố, bình lắc, ly nhựa.\nChỉ giải thích ngắn gọn lý do chọn thiết bị, không mô tả chi tiết, không liệt kê đặc điểm kỹ thuật.\nChỉ trả về tiếng Việt, đúng cú pháp JSON: {\"keywords\": [\"từ khóa 1\", ...], \"explanation\": \"giải thích ngắn gọn\"}`;
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Từ khóa cho: ${query}` }
      ],
      model: process.env.MODEL_NAME,
      temperature: 0.7,
      max_tokens: 80,
      response_format: { type: "json_object" }
    });
    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) return [];
    try {
      const parsed = JSON.parse(responseContent);
      if (parsed.keywords && Array.isArray(parsed.keywords)) {
        const keywords = parsed.keywords.filter(k => typeof k === 'string').slice(0, numKeywords);
        console.log('[AI KEYWORDS]', keywords, 'for query:', query);
        return keywords;
      }
    } catch (e) {
      return [];
    }
    return [];
  } catch (error) {
    return [];
  }
}

module.exports = {
  generateKeywordsWithGroq
}; 