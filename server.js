const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

// OpenAI kulcs környezeti változóból
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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