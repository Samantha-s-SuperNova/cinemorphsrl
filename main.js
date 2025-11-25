// SuperNova Dashboard Logic — Samantha's Universe

// ---------- Helpers ----------
function getTimeStamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `[${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
    now.getSeconds()
  )}]`;
}

function appendLog(line) {
  const log = document.getElementById("logOutput");
  if (!log) return;

  const atBottom =
    log.scrollTop + log.clientHeight >= log.scrollHeight - 3;

  log.textContent += line + "\n";

  if (atBottom) {
    log.scrollTop = log.scrollHeight;
  }
}

function setSystemStatus(mode, text) {
  const pill = document.getElementById("systemStatus");
  if (!pill) return;

  pill.classList.remove("listening", "offline");
  const label = pill.querySelector(".label");
  const dot = pill.querySelector(".dot");

  if (mode === "listening") {
    pill.classList.add("listening");
    if (dot) {
      dot.style.background = "#ffd773";
      dot.style.boxShadow = "0 0 10px #ffd773";
    }
  } else if (mode === "offline") {
    pill.classList.add("offline");
    if (dot) {
      dot.style.background = "#ff5573";
      dot.style.boxShadow = "0 0 10px #ff5573";
    }
  } else {
    // online
    if (dot) {
      dot.style.background = "#7fffb7";
      dot.style.boxShadow = "0 0 10px #7fffb7";
    }
  }

  if (label && text) {
    label.textContent = text;
  }
}

// ---------- Nova Button (AI only, no deploy) ----------
function handleNovaPress() {
  const btn = document.getElementById("novaButton");
  if (btn) {
    btn.classList.add("active");
    setTimeout(() => btn.classList.remove("active"), 180);
  }

  setSystemStatus("listening", "System: Listening");
  appendLog(
    `${getTimeStamp()} [NOVA] Listening… type a command below when you're ready.`
  );
}

// ---------- Typed Command Handling ----------
function generateNovaReply(commandText) {
  const lower = commandText.toLowerCase();

  if (lower.includes("status")) {
    return "Status: dashboard online, Nova engine listening, portals ready in Samantha’s Universe.";
  }
  if (lower.includes("voice")) {
    return "Voice Simulator will handle your real-time voice interface and testing once wired to the backend.";
  }
  if (lower.includes("game")) {
    return "Game Portal is reserved for your interactive mission builder and scenarios.";
  }
  if (lower.includes("movie") || lower.includes("cineverse")) {
    return "Cineverse Creator is your cinematic builder for scenes and storylines.";
  }
  if (lower.includes("deploy")) {
    return "Reminder: the pink Nova orb never deploys anything. Use the Deployment Panel buttons only.";
  }

  // Short default, so it doesn't feel repetitive
  return "Command noted in Samantha’s Universe console.";
}

function sendCommand() {
  const input = document.getElementById("novaInput");
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  // Log user command
  appendLog(`${getTimeStamp()} [USER] ${text}`);

  // Generate Nova reply
  const reply = generateNovaReply(text);
  appendLog(`${getTimeStamp()} [NOVA] ${reply}`);

  // Reset input & system status
  input.value = "";
  setSystemStatus("online", "System: Online");
}

// ---------- Deployment Panel (log-only) ----------
function handleDeploymentAction(actionKey) {
  let message;

  switch (actionKey) {
    case "local-preview":
      message =
        "Local preview requested. Open this index.html in your browser to review the dashboard.";
      break;
    case "vercel-deploy":
      message =
        "Vercel deploy requested (log-only). Use your Vercel dashboard when you’re ready.";
      break;
    case "refresh-env":
      message =
        "Environment refresh requested. Reload the page or redeploy after file changes.";
      break;
    default:
      message = `Unknown deployment action: ${actionKey}`;
      break;
  }

  appendLog(`${getTimeStamp()} [DEPLOY] ${message}`);
}

// ---------- Portal Tiles ----------
function handlePortalClick(tile) {
  const portal = tile.getAttribute("data-portal") || "#/unknown";
  const label =
    tile.querySelector("h3")?.textContent?.trim() || "Unknown Portal";

  document.querySelectorAll(".portal-tile").forEach((el) => {
    el.classList.remove("active");
  });
  tile.classList.add("active");

  appendLog(
    `${getTimeStamp()} [DASH] Focus routed to ${portal} — ${label}. (Visual route only in this prototype.)`
  );
}

// ---------- Clear Log ----------
function clearLog() {
  const log = document.getElementById("logOutput");
  if (!log) return;
  log.textContent = "";
  appendLog(`${getTimeStamp()} [SYSTEM] Log cleared.`);
}

// ---------- INIT ----------
function initDashboard() {
  appendLog(
    `${getTimeStamp()} [SYSTEM] Samantha's SuperNova Dashboard initialized.`
  );
  appendLog(
    `${getTimeStamp()} [UNIVERSE] Ready. Visual core online; Work Environment waiting for your next object.`
  );

  setSystemStatus("online", "System: Online");

  // Nova button
  const novaButton = document.getElementById("novaButton");
  if (novaButton) {
    novaButton.addEventListener("click", handleNovaPress);
  }

  // Deploy buttons
  document.querySelectorAll(".deploy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-action");
      if (action) handleDeploymentAction(action);
    });
  });

  // Portal tiles
  document.querySelectorAll(".portal-tile").forEach((tile) => {
    tile.addEventListener("click", () => handlePortalClick(tile));
  });

  // Command send button
  const sendButton = document.getElementById("sendCommand");
  if (sendButton) {
    sendButton.addEventListener("click", sendCommand);
  }

  // Enter key for command input
  const input = document.getElementById("novaInput");
  if (input) {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendCommand();
      }
    });
  }

  // Clear log button
  const clearButton = document.getElementById("clearLogButton");
  if (clearButton) {
    clearButton.addEventListener("click", clearLog);
  }
}

document.addEventListener("DOMContentLoaded", initDashboard);
