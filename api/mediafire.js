const express = require("express");
const cheerio = require("cheerio");
const { fetch } = require("undici");
const { lookup } = require("mime-types");

const router = express.Router();

async function mediafire(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        const type = $(".dl-btn-cont").find(".icon").attr("class").split("archive")[1].trim();
        const filename = $(".dl-btn-label").attr("title");
        const size = $('.download_link .input').text().trim().match(/\((.*?)\)/)[1];
        const ext = filename.split(".").pop();
        const mimetype = lookup(ext.toLowerCase()) || "application/" + ext.toLowerCase();
        const download = $(".input").attr("href");

        return { filename, type, size, ext, mimetype, download };
    } catch (e) {
        return { msg: "Gagal mengambil data dari link tersebut" };
    }
}

router.get("/mediafire", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Masukkan parameter ?url=" });

    const result = await mediafire(url);
    if (!result.download) return res.status(500).json({ error: "Gagal mengambil link download" });
    res.redirect(result.download);
});

module.exports = router;
