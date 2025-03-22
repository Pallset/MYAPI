const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get("/gemini", async (req, res) => {
    try {
        let userPrompt = req.query.prompt || "Halo!";

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent(userPrompt);

        let reply = result.response.text().trim();
        if (!reply || reply.length < 3) reply = "Gw bingung jawabnya 😅.";

        res.json({
            status: 200,
            result: reply,
            time: new Date().toLocaleString(),
            creator: "PeeX - Authority",
            channel: "t.me/sharingscript/"
        });

    } catch (error) {
        console.error("Error:", error.message);
        res.json({
            status: 500,
            result: "Server error! Coba lagi nanti.",
            time: new Date().toLocaleString(),
            creator: "PeeX - Authority",
            channel: "t.me/sharingscript/"
        });
    }
});

module.exports = router;
