const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Send a user question to OpenAI and get a real-estate focused reply.
 * @param {string} userMessage
 * @returns {Promise<string>}
 */
async function getAIReply(userMessage) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful real estate assistant for Shubhstra Properties. " +
          "Answer questions about properties, pricing, and availability concisely. " +
          "Keep replies under 200 words and always end by suggesting the user type '4' to talk to an expert.",
      },
      { role: "user", content: userMessage },
    ],
    max_tokens: 250,
  });

  return completion.choices[0].message.content.trim();
}

module.exports = { getAIReply };
