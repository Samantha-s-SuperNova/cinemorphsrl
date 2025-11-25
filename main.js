/* ============================================================
   SAMANTHA'S SUPERNOVA DASHBOARD — FULL WORKING DEPLOY SYSTEM
   This file controls:
   - Motion toggle
   - Pipeline state
   - Mission status blinking bar
   - Deploy buttons (Cine, Game, Voice, All)
   - API calls to /api/deploy
   ============================================================ */

console.log("Nova main.js loaded.");

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
   DEPLOY FUNCTION — CALLS /api/deploy?site=x
------------------------------------------------------------ */
async function triggerDeploy(site) {
  try {
    const res = await fetch(`/api/deploy?site=${site}`);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();

    log(`Deploy triggered for: ${site.toUpperCase()}`);
    alert(
      `Deploy Started\n\n` +
      `Module: ${site.toUpperCase()}\n` +
      `Message: ${json.message || "Triggered"}\n` +
      `Vercel will run the deploy in the background.`
    );

  } catch (err) {
    console.error(err);
    alert(`Deploy Failed for ${site.toUpperCase()}`);
    log(`Deploy FAILED for ${site.toUpperCase()}`);
  }
}

/* ------------------------------------------------------------
   BUTTON EVENT WIRING
------------------------------------------------------------ */
function wireButtons() {
  if (wireButtons.done) return; 
  wireButtons.done = true;

  deployCineBtn?.addEventListener("click", () => triggerDeploy("cine"));
  deployGameBtn?.addEventListener("click", () => triggerDeploy("game"));
  deployVoiceBtn?.addEventListener("click", () => triggerDeploy("voice"));
  deployAllBtn?.addEventListener("click", () => triggerDeploy("all"));

  deployNowTop?.addEventListener("click", () => {
    triggerDeploy("cine");  
  });
}

wireButtons();

/* ------------------------------------------------------------
   LOG SYSTEM
------------------------------------------------------------ */
function log(text) {
  const time = new Date().toLocaleString();
  const item = document.createElement("div");
  item.className = "log-item";
  item.innerHTML = `
    <div>${text}</div>
    <div class="log-time">${time}</div>
  `;
  novaLog.prepend(item);
}

/* ------------------------------------------------------------
   SIMPLE MISSION DISPLAY
------------------------------------------------------------ */
function updateMission() {
  missionText.textContent = `"Cineverse Portal UI expansion" is ready to deploy.`;
  missionBanner.classList.add("blink-ready");
  novaState.textContent = "WORKING";
}

updateMission();

console.log("Nova main.js successfully wired.");

