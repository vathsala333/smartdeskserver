import axios from "axios";

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const TOKEN = process.env.CLOUDFLARE_API_TOKEN;

const CF_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/meta/llama-3-8b-instruct`;

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};


// ======================================================
// 🧠 CLASSIFICATION
// ======================================================
export const analyzeTicket = async (text) => {
  if (!text) return {};

  try {
    const response = await axios.post(
      CF_URL,
      {
        messages: [
          {
            role: "system",
            content:
              "Classify the support ticket. Return ONLY JSON like this: { category:'', priority:'', sentiment:'' }"
          },
          { role: "user", content: text }
        ]
      },
      { headers }
    );

    const output = response.data.result.response || "{}";

    const match = output.match(/\{[\s\S]*\}/);

    return match ? JSON.parse(match[0]) : {};
  } catch (err) {
    console.error("Classification error:", err.message);
    return {};
  }
};



// ======================================================
// 💬 AI REPLY  (IMPORTANT FIX)
// ======================================================
export const generateReply = async (text) => {
  if (!text) return "Thanks for contacting support.";

  try {
    const response = await axios.post(
      CF_URL,
      {
        messages: [
          {
            role: "system",
            content:
              "You are a professional customer support agent. Reply clearly and helpfully in 1-2 sentences."
          },
          {
            role: "user",
            content: text
          }
        ]
      },
      { headers }
    );

    return (
      response.data.result.response ||
      "Our support team will get back to you shortly."
    );
  } catch (err) {
    console.error("Reply error:", err.message);
    return "AI unavailable. Please try later.";
  }
};
