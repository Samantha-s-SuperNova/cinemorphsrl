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

// ---------- Active Task helpers ----------
function setActiveTask(taskText) {
  const el = document.getElementById("activeTaskValue");
  if (!el) return;
  el.textContent = taskText ? taskText : "None";
}

function startTransientTask(label, durationMs) {
  if (!label) {
    setActiveTask(null);
    return;
  }
  setActiveTask(label);
  setTimeout(() => {
    const el = document.getElementById("activeTaskValue");
    if (el && el.textContent === label) {
      setActiveTask(null);
    }
  }, durationMs);
}

// ---------- Nova Button (AI only, no deploy) ----------
function handleNovaPress() {
  const btn = document.getElementById("novaButton");
  if (btn) {
    btn.classList.add("active");
    setTimeout(() => btn.classList.remove("active"), 200);
  }

  setSystemStatus("listening", "System: Listening");
  appendLog(`${getTimeStamp()} [NOVA] Listening… you can type now.`);

  // mark as active task for 5 seconds
  startTransientTask("Listening for command input…", 5000);

  // AUTO-RESET AFTER 5 SECONDS
  setTimeout(() => {
    setSystemStatus("online", "System: Online");
    appendLog(`${getTimeStamp()} [SYSTEM] Listening timeout — back to idle.`);
    startTransientTask(null, 0);
  }, 5000);
}

// ---------- Typed Command Handling ----------
function generateNovaReply(commandText) {
  const lower = commandText.toLowerCase();

  if (lower.includes("status")) {
    return "Dashboard online, Nova responsive, and portals ready in Samantha’s Universe.";
  }
  if (lower.includes("voice")) {
    return "Voice Simulator will handle your real-time voice control once it’s wired to the backend.";
  }
  if (lower.includes("game")) {
    return "Game Portal is your interactive mission builder and scenario lab.";
  }
  if (lower.includes("movie") || lower.includes("cineverse")) {
    return "Cineverse Creator is your cinematic builder for scenes, sequences, and universes.";
  }
  if (lower.includes("deploy")) {
    return "The pink Nova orb never deploys anything. Use the Deployment Panel buttons for log-only deploy events.";
  }
  if (lower.includes("market")) {
    return "Marketplace is your hub for add-ons, bundles, and future upgrades once wired to live data.";
  }

  // Default conversational reply
  return "Understood. I’ve logged that inside Samantha’s Universe.";
}

function sendCommand() {
  const input = document.getElementById("novaInput");
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  // Log user command
  appendLog(`${getTimeStamp()} [USER] ${text}`);

  // Immediate Nova reply (conversational)
  const reply = generateNovaReply(text);
  appendLog(`${getTimeStamp()} [NOVA] ${reply}`);

  // Reset input & ensure status is online
  input.value = "";
  setSystemStatus("online", "System: Online");
}

// ---------- Deployment Panel (log-only, updates Active Task briefly) ----------
function handleDeploymentAction(actionKey) {
  let message;
  let taskLabel;

  switch (actionKey) {
    case "local-preview":
      message =
        "Local preview requested. Open this index.html in your browser to review the dashboard.";
      taskLabel = "Preparing local preview (log-only)…";
      break;
    case "vercel-deploy":
      message =
        "Vercel deploy requested (log-only). Use your Vercel dashboard when you’re ready.";
      taskLabel = "Vercel deploy logged (no action)…";
      break;
    case "refresh-env":
      message =
        "Environment refresh requested. Reload the page or redeploy after file changes.";
      taskLabel = "Refreshing environment (log-only)…";
      break;
    default:
      message = `Unknown deployment action: ${actionKey}`;
      taskLabel = null;
      break;
  }

  appendLog(`${getTimeStamp()} [DEPLOY] ${message}`);

  if (taskLabel) {
    startTransientTask(taskLabel, 5000);
  }
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

// ---------- Drag & Drop for lower portals ----------
let dragSrcTile = null;

function handleTileDragStart(e) {
  dragSrcTile = this;
  this.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", this.dataset.key || "");
}

function handleTileDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

function handleTileDrop(e) {
  e.preventDefault();
  const row = document.getElementById("reorderRow");
  if (!row || !dragSrcTile) return;

  const target = this;
  if (target === dragSrcTile) return;
  if (!row.contains(target)) return;

  const children = Array.from(row.children);
  const srcIndex = children.indexOf(dragSrcTile);
  const tgtIndex = children.indexOf(target);

  if (srcIndex < 0 || tgtIndex < 0) return;

  if (srcIndex < tgtIndex) {
    row.insertBefore(dragSrcTile, target.nextSibling);
  } else {
    row.insertBefore(dragSrcTile, target);
  }

  // Log new order
  const newOrder = Array.from(row.children)
    .map((el) => el.querySelector("h3")?.textContent?.trim() || "")
    .join(" | ");
  appendLog(
    `${getTimeStamp()} [DASH] Reordered lower portals: ${newOrder}.`
  );
}

function handleTileDragEnd() {
  this.classList.remove("dragging");
  dragSrcTile = null;
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
  appendLog(`${getTimeStamp()} [SYSTEM] Dashboard loaded.`);
  appendLog(
    `${getTimeStamp()} [UNIVERSE] Visual core online; Work Environment waiting for your next object.`
  );

  setSystemStatus("online", "System: Online");
  setActiveTask(null);

  // Nova button
  const novaButton = document.getElementById("novaButton");
  if (novaButton) {
    novaButton.onclick = handleNovaPress;
  }

  // Deploy buttons
  document.querySelectorAll(".deploy-btn").forEach((btn) => {
    btn.onclick = () => {
      const action = btn.getAttribute("data-action");
      handleDeploymentAction(action);
    };
  });

  // Portal tiles click
  document.querySelectorAll(".portal-tile").forEach((tile) => {
    tile.addEventListener("click", () => handlePortalClick(tile));
  });

  // Drag & drop for lower row
  const row = document.getElementById("reorderRow");
  if (row) {
    const tiles = row.querySelectorAll(".portal-tile");
    tiles.forEach((tile) => {
      tile.addEventListener("dragstart", handleTileDragStart);
      tile.addEventListener("dragover", handleTileDragOver);
      tile.addEventListener("drop", handleTileDrop);
      tile.addEventListener("dragend", handleTileDragEnd);
    });
  }

  // Send button
  const sendButton = document.getElementById("sendCommand");
  if (sendButton) sendButton.onclick = sendCommand;

  // Enter key for input
  const input = document.getElementById("novaInput");
  if (input) {
    input.onkeypress = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendCommand();
      }
    };
  }

  // Clear log button
  const clearButton = document.getElementById("clearLogButton");
  if (clearButton) clearButton.onclick = clearLog;
}

document.addEventListener("DOMContentLoaded", initDashboard);
