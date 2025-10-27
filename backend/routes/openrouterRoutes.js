import express from "express";
import axios from "axios";

const router = express.Router();

// ✅ POST /api/openrouter/generate
router.post("/generate", async (req, res) => {
  try {
    const { messages } = req.body;

    console.log("📨 Using OpenRouter API");
    console.log("🔑 OpenRouter Key exists:", !!process.env.OPENROUTER_API_KEY);

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        error: "❌ OpenRouter API key not configured in server (.env missing or invalid)"
      });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini", 
        messages,
        max_tokens: 200,
        temperature: 0.7,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.APP_URL || "http://localhost:5173", // ✅ dynamic referer
          "X-Title": "ResumeBot",
        },
        timeout: 30000,
      }
    );

    console.log("✅ OpenRouter API success");

    // ✅ Safely return the response
    res.json({
      output: [
        {
          content: response.data?.choices?.[0]?.message?.content || "⚠️ No content received from API.",
        },
      ],
    });
  } catch (err) {
    console.error("❌ OpenRouter API error:", err.response?.data || err.message);

    const errorMessage =
      err.response?.data?.error?.message || "OpenRouter API request failed.";

    res.status(500).json({
      error: errorMessage,
      details: err.response?.data || err.message,
    });
  }
});

// ✅ Test route
router.get("/test", (req, res) => {
  res.json({ message: "✅ OpenRouter route is working!" });
});

export default router;
