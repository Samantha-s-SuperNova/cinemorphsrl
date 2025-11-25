// Utility: timestamp
function getTimeStamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `[${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}]`;
}

// Logging helper
function appendLog(text) {
  const log = document.getElementById("logOutput");
  if (!log) return;
  log.textContent += text + "\n";
  log.scrollTop = log.scrollHeight;
}

// Status pill
function setStatusOnline() {
  const pill = document.getElementById("systemStatus");
  pill.querySelector(".label").textContent = "System: Listening";
  pill.querySelector(".dot").style.background = "#7fffb7";
}

// Nova button
function handleNovaPress() {
  appendLog(`${getTimeStamp()} [NOVA] Button pressed. Listening…`);
  setStatusOnline();
}

// Deployment actions
function handleDeploymentAction(action) {
  appendLog(`${getTimeStamp()} [DEPLOY] ${action} requested.`);
}

// Portal select
function handlePortalClick(tile) {
  document.querySelectorAll(".portal-tile").forEach((el) =>
    el.classList.remove("active")
  );
  tile.classList.add("active");

  const portal = tile.getAttribute("data-portal");
  appendLog(`${getTimeStamp()} [DASH] Opening ${portal}…`);
}

// Send typed command
function sendCommand() {
  const input = document.getElementById("novaInput");
  const text = input.value.trim();
  if (!text) return;

  appendLog(`${getTimeStamp()} [USER] ${text}`);
  appendLog(`${getTimeStamp()} [NOVA] Acknowledged: "${text}". Processing…`);

  input.value = "";
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  appendLog(`${getTimeStamp()} [SYSTEM] Dashboard initialized.`);

  document.getElementById("novaButton").addEventListener("click", handleNovaPress);

  document.querySelectorAll(".action-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      handleDeploymentAction(btn.getAttribute("data-action"))
    );
  });

  document.querySelectorAll(".portal-tile").forEach((tile) => {
    tile.addEventListener("click", () => handlePortalClick(tile));
  });

  document
    .getElementById("sendCommand")
    .addEventListener("click", sendCommand);

  document
    .getElementById("novaInput")
    .addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendCommand();
    });

  document
    .getElementById("clearLogButton")
    .addEventListener("click", () => (document.getElementById("logOutput").textContent = ""));
});
