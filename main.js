/* ============================================================
   SAMANTHA'S SUPERNOVA DASHBOARD — LIVE DEPLOY SYSTEM
   Clean, functional version:
   - POST deploy calls to /api/deploy
   - Proper button wiring
   - Logs deploy actions
   - No duplicate logic
============================================================ */

console.log("Nova main.js loaded (POST deploy active).");

/* ------------------------------------------------------------
   DOM REFERENCES
------------------------------------------------------------ */
const deployCineBtn  = document.getElementById("deployCineBtn");
const deployGameBtn  = document.getElementById("deployGameBtn");
const deployVoiceBtn = document.getElementById("deployVoiceBtn");
const deployAllBtn   = document.getElementById("deployAllBtn");

const deployNowTop   = document.getElementById("deployNowTop");

const missionText    = document.getElementById("missionText");
const missionBanner  = document.getElementById("missionBanner");
const novaLog        = document.getElementById("novaLog");
const novaState      = document.getElementById("novaState");


/* ------------------------------------------------------------
   DEPLOY FUNCTION — POST request to /api/deploy
------------------------------------------------------------ */
async function triggerDeploy(name) {
  try {
    const res = await fetch("/api/deploy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Nova Deploy Triggered: ${name}`,
        files: [],      // no auto commits yet
        site: name
      })
    });

    const json = await res.json();

    if (!res.ok || !json.ok) {
      throw new Error(json.error || "Deploy error");
    }

    log(`Deploy triggered for: ${name.toUpperCase()}`);

    alert(
      `Nova Deploy Started\n\n` +
      `Module: ${name.toUpperCase()}\n` +
      `Message: ${json.message || "Triggered"}\n\n` +
      `Vercel is now deploying in the background.`
    );

  } catch (err) {
    console.error(err);
    log(`Deploy FAILED for ${name.toUpperCase()}`);
    alert(`Deploy FAILED for ${name.toUpperCase()}`);
  }
}


/* ------------------------------------------------------------
   BUTTON WIRING
------------------------------------------------------------ */
function wireButtons() {
  if (wireButtons.done) return;
  wireButtons.done = true;

  deployCineBtn?.addEventListener("click", () => triggerDeploy("cine"));
  deployGameBtn?.addEventListener("click", () => triggerDeploy("game"));
  deployVoiceBtn?.addEventListener("click", () => triggerDeploy("voice"));
  deployAllBtn?.addEventListener("click", () => triggerDeploy("all"));

  // Top banner deploy button
  deployNowTop?.addEventListener("click", () => triggerDeploy("cine"));
}

wireButtons();


/* ------------------------------------------------------------
   LOGGING (Dashboard panel)
------------------------------------------------------------ */
function log(text) {
  const time = new Date().toLocaleString();
  const row = document.createElement("div");
  row.className = "log-item";
  row.innerHTML = `
    <div>${text}</div>
    <div class="log-time">${time}</div>
  `;
  novaLog.prepend(row);
}


/* ------------------------------------------------------------
   MISSION STATUS DISPLAY
------------------------------------------------------------ */
function updateMission() {
  missionText.textContent = `"Cineverse Portal UI expansion" is ready to deploy.`;
  missionBanner.classList.add("blink-ready");
  novaState.textContent = "WORKING";
}

updateMission();

console.log("Nova main.js is fully online.");
