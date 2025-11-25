/* ============================================================
   GAME PORTAL — CinemorphSRL
   Hybrid Neon Grid + Sci-Fi Control Room + Vaporwave Hub
   Dedicated logic for the Game Portal (independent of dashboard)
   ============================================================ */

/* ----------- Motion Toggle ------------- */
const motionToggle = document.getElementById("motionToggle");
const MOTION_KEY = "gp_motion";

initMotion();

function initMotion() {
  const saved = localStorage.getItem(MOTION_KEY);
  const motionOn = saved !== "off"; // default ON
  setMotion(motionOn);

  motionToggle.addEventListener("click", () => {
    const nowOn = !document.body.classList.contains("animated");
    setMotion(nowOn);
  });
}

function setMotion(on) {
  document.body.classList.toggle("animated", on);
  localStorage.setItem(MOTION_KEY, on ? "on" : "off");
  motionToggle.textContent = `Motion: ${on ? "ON" : "OFF"}`;
}


/* ----------- Tile Buttons ------------- */

document.getElementById("builderBtn")?.addEventListener("click", () => {
  alert("Game Builder module loading soon…");
});

document.getElementById("assetsBtn")?.addEventListener("click", () => {
  alert("Assets & Avatars module coming online shortly…");
});

document.getElementById("levelsBtn")?.addEventListener("click", () => {
  alert("Level Studio not unlocked yet — pending pipeline deployment.");
});

document.getElementById("testBtn")?.addEventListener("click", () => {
  alert("Running test launcher… (simulation mode).");
});

document.getElementById("analyticsBtn")?.addEventListener("click", () => {
  alert("Analytics dashboard will activate in a future obstacle.");
});

document.getElementById("marketBtn")?.addEventListener("click", () => {
  alert("Marketplace module will connect once tiering is activated.");
});


/* ----------- Top-Bar Launch Test Button ------------- */

document.getElementById("launchTestBtn")?.addEventListener("click", () => {
  alert("Test Launch Initiated.\n(This is a placeholder for your real testing engine.)");
});
