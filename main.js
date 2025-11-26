console.log("SuperNova Dashboard Loaded");

function log(msg) {
  const el = document.getElementById("logBody");
  const line = document.createElement("div");
  line.innerHTML = `<span style="opacity:.6">[${new Date().toLocaleTimeString()}]</span> ${msg}`;
  el.appendChild(line);
  el.scrollTop = el.scrollHeight;
}

document.getElementById("novaButton").addEventListener("click", async () => {
  log("🟦 Nova: Triggering deployment...");

  try {
    const res = await fetch("/api/nova");
    const data = await res.json();

    log(`🟦 Nova: ${data.message}`);
  } catch (err) {
    log("🔴 Nova: Deployment failed.");
  }
});
