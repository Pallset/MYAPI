const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get("/gemimg", async (req, res) => {
    try {
        let userPrompt = req.query.prompt;
        if (!userPrompt) {
            return res.status(400).json({
                status: 400,
                error: "Parameter 'prompt' harus diisi!"
            });
        }
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            generationConfig: {
                responseModalities: ['Text', 'Image']
            },
        });

        const response = await model.generateContent(userPrompt);
        let imageData = response.response.candidates[0].content.parts.find(p => p.inlineData)?.inlineData?.data;

        if (!imageData) throw new Error("Gagal generate gambar!");
        const imagePath = path.join(__dirname, "generated_image.png");
        fs.writeFileSync(imagePath, Buffer.from(imageData, 'base64'));
        res.json({
            status: 200,
            download_url: `http://localhost:3010/generated_image.png`,
            time: new Date().toLocaleString(),
            creator: "PeeX - Authority",
            channel: "t.me/sharingscript/"
        });

    } catch (error) {
        console.error("Error AI:", error.message);
        res.status(500).json({
            status: 500,
            error: "Server error, coba lagi ntar!"
        });
    }
});

router.get("/generated_image.png", (req, res) => {
    const imagePath = path.join(__dirname, "generated_image.png");
    res.sendFile(imagePath);
});

module.exports = router;
