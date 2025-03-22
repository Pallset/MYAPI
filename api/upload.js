const express = require("express");
const axios = require("axios");
const fs = require("fs");
const fileType = require("file-type");
const FormData = require("form-data");

const router = express.Router();

router.post("/upload", async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ status: 400, error: "File tidak ditemukan" });
        }

        const media = req.files.file.data;
        const uploadedUrl = await uploadToPomf(media);

        res.json({
            status: 200,
            url: uploadedUrl,
            message: "Upload berhasil",
        });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
});

router.get("/upload", async (req, res) => {
    try {
        let { link, type } = req.query;
        if (!link) return res.status(400).json({ status: 400, error: "Masukkan link gambar" });
        let response = await axios.get(link, { responseType: "arraybuffer" });
        let media = Buffer.from(response.data);
        let uploadedUrl;
        if (type === "catbox") {
            uploadedUrl = await uploadToCatbox(media);
        } else {
            uploadedUrl = await uploadToPomf(media);
        }

        res.json({
            status: 200,
            url: uploadedUrl,
            message: "Upload berhasil",
        });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
});

async function uploadToPomf(media) {
    try {
        let mime = await fileType.fromBuffer(media);
        let form = new FormData();
        form.append("files[]", media, `file-${Date.now()}.${mime.ext}`);

        let { data } = await axios.post("https://pomf.lain.la/upload.php", form, {
            headers: { ...form.getHeaders() },
        });

        return data.files[0].url;
    } catch (error) {
        throw new Error(`Gagal upload ke Pomf: ${error.message}`);
    }
}

async function uploadToCatbox(media) {
    try {
        let mime = await fileType.fromBuffer(media);
        let form = new FormData();
        form.append("fileToUpload", media, `file-${Date.now()}.${mime.ext}`);
        form.append("reqtype", "fileupload");

        let { data } = await axios.post("https://catbox.moe/user/api.php", form, {
            headers: { ...form.getHeaders() },
        });

        return data.trim();
    } catch (error) {
        throw new Error(`Gagal upload ke Catbox: ${error.message}`);
    }
}

module.exports = router;
