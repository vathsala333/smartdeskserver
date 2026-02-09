import axios from "axios";

export const analyzeTicket = async (text) => {
  // Safety check to prevent errors with empty input
  if (!text || text.trim().length === 0) {
    console.warn("AI called with empty text, returning defaults.");
    return { category: "General", priority: "Medium", sentiment: "Neutral" };
  }

  // Debugging: Check if the key is actually loaded
  if (!process.env.HF_API_KEY) {
      console.error("CRITICAL: HF_API_KEY is missing from environment variables!");
  }

  try {
    // 🟢 CORRECTED URL: Use the router.huggingface.co endpoint
    const response = await axios.post(
      "https://router.huggingface.co",
      {
        inputs: `Classify this support ticket into JSON:
{
 "category": "",
 "priority": "",
 "sentiment": ""
}
Ticket: ${text}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    const output = response.data?.[0]?.generated_text || "";
    const match = output.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : {};

  } catch (err) {
    // This provides much more detail than "Not Found"
    console.error("AI Service Error Details:", err.response?.data || err.message);
    return { category: "Error", priority: "Medium", sentiment: "Error" };
  }
};

export const generateReply = async (req, res) => {
  try {
    const { message } = req.body;

    // 🟢 CORRECTED URL: Use the router.huggingface.co endpoint
    const response = await axios.post(
      "https://router.huggingface.co",
      {
        inputs: `You are a helpful customer support assistant. Reply politely to this customer message:\n${message}`,
        options: { wait_for_model: true }
      },
      {
        headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
        timeout: 20000,
      }
    );

    let reply = response.data?.[0]?.generated_text || "We will get back to you shortly.";
    res.json({ reply });

  } catch (err) {
    console.error("HF Error:", err.response?.data || err.message);
    res.status(500).json({ reply: "Sorry, our AI assistant is currently unavailable." });
  }
};

// 🛑 CRITICAL: Make sure there are NO lines of code calling these functions at the very bottom of this file. 🛑
