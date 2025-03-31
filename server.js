const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

// SAJÁT API KULCS BEÉPÍTVE
const OPENAI_API_KEY = "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";

app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Hiba az OpenAI hívásnál:", error.message);
    res.status(500).json({ error: "Hiba történt a generálás során." });
  }
});

app.listen(port, () => {
  console.log(`Szerver fut a ${port} porton`);
});