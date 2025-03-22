require("dotenv").config();
const express = require("express");
const axios = require("axios");
const fs = require("fs");
const app = express();

app.get("/api/tts", async (req, res) => {
    const text = req.query.text || "Halo, ini suara AI";
    const lang = req.query.lang || "id-ID";
    const apiKey = process.env.GOOGLE_TTS_API_KEY;

    if (!apiKey) return res.status(500).json({ error: "API Key tidak ditemukan di .env" });

    const apiUrl = "https://texttospeech.googleapis.com/v1/text:synthesize";
    const payload = {
        input: { text },
        voice: { languageCode: lang, ssmlGender: "NEUTRAL" },
        audioConfig: { audioEncoding: "MP3" }
    };

    try {
        const response = await axios.post(`${apiUrl}?key=${apiKey}`, payload);
        const audioContent = response.data.audioContent;

        const fileName = `tts_${Date.now()}.mp3`;
        fs.writeFileSync(fileName, Buffer.from(audioContent, "base64"));

        res.download(fileName, () => fs.unlinkSync(fileName));

    } catch (error) {
        res.status(500).json({ error: "Gagal generate suara", detail: error.message });
    }
});

module.exports = app;
