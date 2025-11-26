console.log("Game Portal V7.2 loaded");

function now() {
  const d = new Date();
  return `[${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}]`;
}
const logBody = document.getElementById("logBody");
function log(l, t, m) {
  if (!logBody) return;
  const div = document.createElement("div");
  div.className = "log-line";
  div.innerHTML = `<span class="log-time">${now()}</span><span>[${t}]</span><span>${l}</span><span>${m}</span>`;
  logBody.appendChild(div);
  logBody.scrollTop = logBody.scrollHeight;
}

log("READY", "GAME", "Portal online.");

// Back → Dashboard
document.querySelector("[data-back]")?.addEventListener("click", () => {
  log("NAV", "PORTAL", "Back to Dashboard");
  location.href = "../index.html";
});

// Studio / Roadmap hooks
document.getElementById("btnEnter")?.addEventListener("click", () => {
  log("OPEN", "HUB", "Opening Game Studio");
  alert("Game Studio placeholder.");
});

document.getElementById("btnRoadmap")?.addEventListener("click", () => {
  log("INFO", "ROADMAP", "Viewing Game roadmap");
  alert("Roadmap placeholder.");
});

// Launch & Deploy visual simulation
const novaDeploy = document.getElementById("novaDeployButton");
const statusEl = document.getElementById("portalStatus");

novaDeploy.onclick = () => {
  statusEl.textContent = "In progress";
  log("RUN", "NOVA", "Game deploy simulation…");

  const steps = ["Checking assets…", "Validating sprites…", "Syncing Universe…", "Finalizing…"];
  let i = 0;
  const t = setInterval(() => {
    log("SCAN", "NOVA", steps[i]);
    i++;
    if (i >= steps.length) {
      clearInterval(t);
      statusEl.textContent = "Deploy ready";
      log("DONE", "NOVA", "Game portal ready.");
    }
  }, 600);
};

// ---------- Nova Chat (Game) ----------
const chatPanel = document.getElementById("novaChatPanel");
const chatToggle = document.getElementById("novaChatToggle");
const chatClose = document.getElementById("chatCloseBtn");
const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

function addChatMessage(who, text) {
  if (!chatMessages) return;
  const div = document.createElement("div");
  div.className = "chat-msg" + (who === "You" ? " me" : "");
  div.innerHTML = `<span class="who">${who}:</span><span>${text}</span>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function openChat() {
  chatPanel.classList.add("open");
  if (!chatMessages.hasChildNodes()) {
    addChatMessage(
      "Nova",
      "Game Portal chat ready. Ask about games, assets, or upcoming obstacles."
    );
  }
}
function closeChat() {
  chatPanel.classList.remove("open");
}

chatToggle?.addEventListener("click", openChat);
chatClose?.addEventListener("click", closeChat);

chatForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = (chatInput.value || "").trim();
  if (!text) return;
  addChatMessage("You", text);
  chatInput.value = "";
  addChatMessage(
    "Nova",
    "In this demo I’m offline, but this is where live game-specific help will appear."
  );
});

