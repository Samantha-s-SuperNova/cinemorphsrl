// Synthetic AI Engine — Layout Micro-Fixes + Command Bridge Chat System
(function () {
  const config = window.SYNTHETIC_AI_CONFIG;
  if (!config) return;

  const ui = config.ui || {};

  /* -----------------------------------------------------------
     BASIC LOGGING TO SAI PANEL
  ----------------------------------------------------------- */
  function log(msg) {
    console.log(msg);
    const el = document.getElementById(ui.logElementId);
    if (el) {
      const d = document.createElement("div");
      d.textContent = msg;
      el.appendChild(d);
      el.scrollTop = el.scrollHeight;
    }
  }

  /* -----------------------------------------------------------
     MICRO FIX RULES (Matches Your Original File)
  ----------------------------------------------------------- */

  function normalizePortal() {
    const cards = [...document.querySelectorAll("[data-sai='portal']")];
    if (!cards.length) return null;

    return {
      label: "Normalize portal cards",
      apply() {
        cards.forEach((c) => {
          c.style.display = "flex";
          c.style.alignItems = "center";
          c.style.justifyContent = "space-between";
          c.style.minWidth = "220px";
          c.style.maxWidth = "220px";
        });
      },
    };
  }

  function normalizeWorkEnv() {
    const cards = [...document.querySelectorAll("[data-sai='work-env']")];
    if (!cards.length) return null;

    return {
      label: "Normalize work environment",
      apply() {
        cards.forEach((c) => {
          c.style.display = "flex";
          c.style.alignItems = "center";
          c.style.justifyContent = "space-between";
        });
      },
    };
  }

  function tightenGaps() {
    const areas = [...document.querySelectorAll("[data-sai='layout']")];
    if (!areas.length) return null;

    return {
      label: "Tighten layout gaps",
      apply() {
        areas.forEach((a) => {
          a.style.display = "flex";
          a.style.flexDirection = "column";
          a.style.rowGap = "0.35rem";
        });
      },
    };
  }

  function collectFixes() {
    return [normalizePortal(), normalizeWorkEnv(), tightenGaps()].filter(Boolean);
  }

  const SAI = {
    scan() {
      log("Scan requested.");
      const fixes = collectFixes();

      if (!fixes.length) {
        log("No layout micro-fixes needed.");
        return [];
      }

      fixes.forEach((f) => log("Found: " + f.label));
      return fixes;
    },

    applyAll() {
      if (config.mode !== "incremental-only") {
        log("Blocked: not in incremental-only mode.");
        return;
      }

      const fixes = this.scan();
      if (!fixes.length) return;

      log("Applying layout micro-fixes...");
      fixes.forEach((f) => f.apply());
      log("Done.");
    },
  };

  window.SyntheticAI = SAI;

  /* -----------------------------------------------------------
     COMMAND BRIDGE CHAT SYSTEM
  ----------------------------------------------------------- */

  const MIN_DELAY = 3000; // 3 seconds
  const wait = (ms) => new Promise((res) => setTimeout(res, ms));

  function addChat(sender, text, typing = false) {
    const box = document.getElementById("cbMessages");
    if (!box) return;

    const msg = document.createElement("div");
    msg.classList.add("cb-msg");

    if (sender === "nova") msg.classList.add("cb-msg-nova");
    if (sender === "sai") msg.classList.add("cb-msg-sai");
    if (typing) msg.classList.add("cb-msg-typing");

    msg.textContent = text;
    box.appendChild(msg);
    box.scrollTop = box.scrollHeight;
    return msg;
  }

  async function novaSays(text) {
    addChat("nova", text);
    await wait(MIN_DELAY);
  }

  async function saiSays(text) {
    const typing = addChat("sai", "SAI is processing…", true);
    await wait(MIN_DELAY);
    if (typing) typing.remove();
    addChat("sai", text);
  }

  async function bridgeGreetingIfEmpty() {
    const box = document.getElementById("cbMessages");
    if (!box || box.childElementCount > 0) return;

    await novaSays("Hi Sam, Command Bridge is online.");
    await saiSays("SAI here — ready for layout micro-fix tasks.");
  }

  async function handleBridgeInput(text) {
    if (!text || !text.trim()) return;

    text = text.trim();
    addChat("nova", text);

    let reply = "Acknowledged. I am ready when you approve fixes.";

    const lower = text.toLowerCase();

    if (lower.includes("scan")) {
      reply = "Use the scan or quick fix buttons — I will prepare results.";
    }

    if (lower.includes("fix")) {
      reply = "I can apply micro-fixes when you click the approval button.";
    }

    if (lower.includes("nova")) {
      reply = "Nova is your strategic intelligence. I execute micro-fix tasks safely.";
    }

    if (lower.includes("hi") || lower.includes("hello")) {
      reply = "Hello Sam — SAI is active on the Command Bridge.";
    }

    await saiSays(reply);
  }

  function openCommandBridge() {
    const panel = document.getElementById("commandBridgePanel");
    if (!panel) return;

    panel.classList.add("cb-panel-visible");
    panel.classList.remove("cb-panel-hidden");

    bridgeGreetingIfEmpty();
  }

  function closeCommandBridge() {
    const panel = document.getElementById("commandBridgePanel");
    if (!panel) return;

    panel.classList.remove("cb-panel-visible");
    panel.classList.add("cb-panel-hidden");
  }

  /* -----------------------------------------------------------
     DOM BINDINGS
  ----------------------------------------------------------- */

  document.addEventListener("DOMContentLoaded", () => {
    // SAI Buttons
    const scanBtn = document.getElementById(ui.scanButtonId);
    const applyBtn = document.getElementById(ui.applyButtonId);
    const quickBtn = document.getElementById(ui.quickFixButtonId);

    if (scanBtn) scanBtn.onclick = () => SAI.scan();
    if (applyBtn) applyBtn.onclick = () => SAI.applyAll();
    if (quickBtn) quickBtn.onclick = () => SAI.applyAll();

    // Command Bridge elements
    const toggle = document.getElementById("commandBridgeToggle");
    const closeBtn = document.getElementById("cbClose");
    const sendBtn = document.getElementById("cbSend");
    const input = document.getElementById("cbInput");
    const applyFixBtn = document.getElementById("cbApplyFixes");

    if (toggle) toggle.onclick = openCommandBridge;
    if (closeBtn) closeBtn.onclick = closeCommandBridge;

    if (sendBtn) {
      sendBtn.onclick = () => {
        const v = input.value;
        input.value = "";
        handleBridgeInput(v);
      };
    }

    if (input) {
      input.onkeydown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const v = input.value;
          input.value = "";
          handleBridgeInput(v);
        }
      };
    }

    if (applyFixBtn) {
      applyFixBtn.onclick = async () => {
        await novaSays("Nova: Sending request to SAI to apply micro-fixes.");
        await saiSays("SAI: Executing micro-fixes now.");
        SAI.applyAll();
      };
    }

    log("Synthetic AI + Command Bridge ready.");
  });
})();
