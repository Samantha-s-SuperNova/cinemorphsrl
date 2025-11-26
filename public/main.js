console.log("Dashboard V7.2 loaded");

// ---------- Helpers ----------
function now() {
  const d = new Date();
  return `[${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}]`;
}

const logBody = document.getElementById("logBody");

function log(level, tag, msg) {
  if (!logBody) return;
  const div = document.createElement("div");
  div.className = "log-line";
  div.innerHTML = `
    <span class="log-time">${now()}</span>
    <span>[${tag}]</span>
    <span>${level}</span>
    <span>${msg}</span>`;
  logBody.appendChild(div);
  logBody.scrollTop = logBody.scrollHeight;
}

log("READY", "DASH", "Dashboard online.");

// ---------- Routing ----------
document.querySelectorAll("[data-open]").forEach((btn) => {
  btn.onclick = () => {
    const dest = btn.getAttribute("data-open");
    log("NAV", "ROUTER", "Opening " + dest);
    location.href = dest;
  };
});

// ---------- Launch & Deploy (local sim) ----------
const novaDeploy = document.getElementById("novaDeployButton");
const statusEl = document.getElementById("portalStatus");

novaDeploy.onclick = () => {
  statusEl.textContent = "In progress";
  log("RUN", "NOVA", "Launch & Deploy pressed…");

  const steps = [
    "Validating Universe routes…",
    "Checking CineVerse portal…",
    "Checking Game portal…",
    "Preparing bundle…"
  ];

  let i = 0;
  const t = setInterval(() => {
    log("SCAN", "NOVA", steps[i]);
    i++;
    if (i >= steps.length) {
      clearInterval(t);
      statusEl.textContent = "Deploy ready";
      log("DONE", "NOVA", "Scan complete.");
    }
  }, 600);
};

// ===============================
// REAL NOVA CHAT (wired to API)
// ===============================
const chatPanel = document.getElementById("novaChatPanel");
const chatToggle = document.getElementById("novaChatToggle");
const chatClose = document.getElementById("chatCloseBtn");
const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

function addChatMessage(who, text) {
  const div = document.createElement("div");
  div.className = "chat-msg" + (who === "You" ? " me" : "");
  div.innerHTML = `<span class="who">${who}:</span><span>${text}</span>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatToggle?.addEventListener("click", () => {
  chatPanel.classList.add("open");
  if (!chatMessages.hasChildNodes()) {
    addChatMessage("Nova", "Dashboard Nova Chat online.");
  }
});

chatClose?.addEventListener("click", () => {
  chatPanel.classList.remove("open");
});

chatForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = chatInput.value.trim();
  if (!text) return;

  addChatMessage("You", text);
  chatInput.value = "";

  addChatMessage("Nova", "Typing…");

  try {
    const res = await fetch("/api/nova-chat.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    chatMessages.lastChild.remove(); // remove "Typing…"

    addChatMessage("Nova", data.reply || "No response.");
  } catch (err) {
    console.error(err);
    chatMessages.lastChild.remove();
    addChatMessage("Nova", "Error contacting AI backend.");
  }
});
