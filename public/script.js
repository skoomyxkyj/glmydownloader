async function download() {
  const btn = document.getElementById("downloadBtn");
  const status = document.getElementById("status");

  const url = document.getElementById("url").value;
  const quality = document.getElementById("quality").value;

  if (!url) {
    alert("Link masih kosong");
    return;
  }

  // 🔒 disable button SEBELUM request
  btn.disabled = true;
  btn.textContent = "Preparing...";
  status.textContent = "Menyiapkan file...";

  try {
    const res = await fetch("/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Token": "ytta"
      },
      body: JSON.stringify({ url, quality })
    });

    if (!res.ok) {
      throw new Error("Request gagal");
    }

    status.textContent = "Mengirim file ke browser...";

    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "gloomy.mp3";
    document.body.appendChild(a);
    a.click();
    a.remove();

    status.textContent = "Download dimulai";
  } catch (e) {
    alert("Download gagal");
    status.textContent = "Gagal download";
  }

  // 🔓 enable lagi
  btn.disabled = false;
  btn.textContent = "Download Now";
}