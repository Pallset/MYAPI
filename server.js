const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

const logicAI = require("./api/logicai");
const gemini = require("./api/gemini");
const gpt = require("./api/gpt");
const gemimg = require("./api/gemimg");
const upload = require("./api/upload");
const mediafire = require("./api/mediafire");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", logicAI);
app.use("/api", gemini);
app.use("/api", gpt);
app.use("/api", gemimg);
app.use("/api", upload);
app.use("/api", mediafire);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
    console.log(`🚀 Server jalan di http://localhost:${PORT}`);
});
