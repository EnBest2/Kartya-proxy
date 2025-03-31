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
    const { tetel, tantargy } = req.body;
    const prompt = `Kérlek készíts tanulókártyákat a következő érettségi tételből (${tantargy}): ${tetel}`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 1000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    // Egyszerűsített válasz visszaadása kártyák formájában
    const valasz = response.data.choices?.[0]?.message?.content || "Nem sikerült válasz.";
    const kartyak = valasz.split("\n").filter(line => line.trim().length > 0);
    res.json({ kartyak });

  } catch (error) {
    console.error("Hiba az OpenAI hívás során:", error.message);
    res.status(500).json({ error: "Hiba történt a generálás során." });
  }
});

app.listen(port, () => {
  console.log(`Szerver fut a ${port} porton`);
});
