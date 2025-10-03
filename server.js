import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static("."));

app.post("/api/ai", async (req, res) => {
  try {
    const { projectTitle, projectDetails, userInput } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if(!apiKey) return res.status(500).json({ error: "Missing API key" });

    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=" + apiKey;

    const systemPrompt = "You are a helpful AI assistant and an expert in quantitative finance. Explain the project clearly and concisely.";
    const userQuery = `Project: ${projectTitle}\nDetails: ${projectDetails}\nQuestion: ${userInput}`;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if(!response.ok){
      const txt = await response.text().catch(()=>null);
      return res.status(500).json({ error: "Gemini API error", detail: txt });
    }

    const result = await response.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply";
    res.json({ reply: text });
  } catch (err) {
    console.error("AI proxy error:", err);
    res.status(500).json({ error: "AI request failed" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
