const getChatResponse = require("../Config/openAI");
async function ChatGpt(data) {
  const { prompt } = data;

  if (!prompt) {
    return { success: false, error: "Prompt is required" };
  }

  try {
    const answer = await getChatResponse(prompt);
    return { success: true, answer };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
module.exports = ChatGpt;
