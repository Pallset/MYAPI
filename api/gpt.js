const express = require("express");
const { OpenAI } = require("openai");

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.get("/gpt", async (req, res) => {
    try {
        let userPrompt = req.query.prompt || "Halo!";

        const result = await openai.chat.completions.create({
            model: "gpt-3.5",
            messages: [{ role: "user", content: userPrompt }],
        });

        let reply = result.choices[0].message.content.trim();
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
