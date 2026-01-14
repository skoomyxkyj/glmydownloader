const TOKEN = "ytta";

const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/download", (req, res) => {
  // 🔐 TOKEN CHECK
  if (req.headers["x-token"] !== TOKEN) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // 📥 ambil body
  const { url, quality } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL kosong" });
  }

  const audioQuality = quality === "320" ? "320K" : "128K";

  // 📂 folder sementara
  const outputDir = path.join(__dirname, "temp");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const filename = `gloomy-${Date.now()}.mp3`;
  const filepath = path.join(outputDir, filename);

  // ▶️ spawn yt-dlp
  const ytdlp = spawn("yt-dlp", [
    "-x",
    "--audio-format", "mp3",
    "--audio-quality", audioQuality,
    "-o", filepath,
    url
  ]);

  ytdlp.on("close", () => {
    // 📤 kirim ke browser
    res.download(filepath, filename, (err) => {
      fs.unlink(filepath, () => {});
      if (err) console.error(err);
    });
  });
});

app.listen(8080, () => {
  console.log("Panel jalan di http://127.0.0.1:8080");
});