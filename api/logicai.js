const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.LOGIC_API_KEY);

router.get("/logicai", async (req, res) => {
    try {
        let userPrompt = req.query.prompt;
        let userLogic = req.query.logic;

        if (!userPrompt || !userLogic) {
            return res.status(400).json({
                status: 400,
                error: "Parameter 'prompt' dan 'logic' harus diisi!"
            });
        }
        const fullPrompt = `${userLogic}\n\nSekarang, jawab pertanyaan ini dengan mengikuti aturan di atas:\n${userPrompt}`;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(fullPrompt);
        let reply = result.response.text().trim();
        if (!reply || reply.length < 3) reply = "Gw bingung jawabnya 😹.";
        res.json({
            status: 200,
            result: reply,
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

module.exports = router;
