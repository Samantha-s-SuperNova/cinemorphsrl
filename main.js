
const novaButton = document.getElementById("novaButton");
const novaStatus = document.getElementById("novaStatus");
const logList = document.getElementById("logList");
const portals = document.querySelectorAll(".portal-card");

function log(message, tag = "NOVA") {
  const li = document.createElement("li");
  const label = document.createElement("span");
  label.className = "tag";
  label.textContent = tag;
  li.appendChild(label);
  li.appendChild(document.createTextNode(message));
  logList.prepend(li);
}

function setStatus(state, text) {
  novaStatus.className = "status-badge " + state;
  novaStatus.textContent = text;
}

async function simulateNoSaRun() {
  setStatus("status-running", "Running");
  log("NoSa activation sequence started.", "NoSa");

  await waitStep("Checking dashboard integrity…", 400);
  await waitStep("Validating security baseline…", 400);
  await waitStep("Scanning portals (Movies / Games / Voice / Marketplace)…", 400);
  await waitStep("Routing verified for Vercel environment.", 400);
  await waitStep("NoSa One‑Click hooks ready for backend wiring.", 400);

  setStatus("status-complete", "Ready");
  log("NoSa front‑end shell wired. Connect backend APIs when ready.", "NoSa");
}

function waitStep(text, ms) {
  return new Promise(resolve => {
    log(text, "TASK");
    setTimeout(resolve, ms);
  });
}

if (novaButton) {
  novaButton.addEventListener("click", () => {
    simulateNoSaRun();
  });
}

portals.forEach(btn => {
  btn.addEventListener("click", () => {
    const portal = btn.dataset.portal;
    log(`Opening ${portal} portal route placeholder (front‑end only).`, "PORTAL");
  });
});

log("Vercel build loaded. NoSa dashboard online.", "SYS");
setStatus("status-idle", "Idle");
