// Synthetic AI — Incremental Update Engine + Command Bridge
(function () {
  const config = window.SYNTHETIC_AI_CONFIG;
  if (!config) return;

  const ui = config.ui || {};

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

  // ========== LAYOUT MICRO-FIX RULES ==========
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

  function collect() {
    return [normalizePortal(), normalizeWorkEnv(), tightenGaps()].filter(
      Boolean
    );
  }

  const SAI = {
    scan() {
      log("Scan requested.");
      const fixes = collect();
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

  // Expose for debugging if needed
  window.SyntheticAI = SAI;

  // ========== COMMAND BRIDGE (NOVA ↔ SAI CHAT) ==========

  const MIN_DELAY_MS = 3000; // 3 seconds minimum between responses

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function addMessageElement(sender, text, isTyping = false) {
    const container = document.getElementById("cbMessages");
    if (!container) return null;

    const bubble = document.createElement("div");
    bubble.classList.add("cb-msg");
    if (sender === "nova") bubble.classList.add("cb-msg-nova");
    if (sender === "sai") bubble.classList.add("cb-msg-sai");
    if (isTyping) bubble.classList.add("cb-msg-typing");

    bubble.textContent = text;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
    return bubble;
  }

  async function novaSpeaks(text) {
    addMessageElement("nova", text, false);
    await delay(MIN_DELAY_MS);
  }

  async function saiSpeaks(text) {
    const typing = addMessageElement("sai", "SAI is processing…", true);
    await delay(MIN_DELAY_MS);
    if (typing) typing.remove();
    addMessageElement("sai", text, false);
  }

  async function handleUserInputToBridge(userText) {
    if (!userText || !userText.trim()) return;

    // Treat as Nova message
    addMessageElement("nova", userText.trim(), false);

    // Basic intent detection (simple, safe)
    const text = userText.toLowerCase();
    let saiReply =
      "Acknowledged. I am ready to support layout and micro-fix tasks when you approve.";

    if (text.includes("scan")) {
      saiReply =
        "I can scan the dashboard for layout micro-fix opportunities. Use the SAI buttons or 'Apply SAI Fixes' to run them.";
    } else if (text.includes("fix")) {
      saiReply =
        "I will prepare micro-fixes. Use 'Apply SAI Fixes' to approve and apply them.";
    } else if (text.includes("hello") || text.includes("hi")) {
      saiReply = "Hello Sam. Nova and I are ready on the Command Bridge.";
    } else if (text.includes("nova")) {
      saiReply =
        "Nova is your strategic brain. I am your micro-fix engine. Together we keep the dashboard clean.";
    }

    await saiSpeaks(saiReply);
  }

  async function initialBridgeGreetingIfEmpty() {
    const container = document.getElementById("cbMessages");
    if (!container) return;
    if (container.childElementCount > 0) return;

    await novaSpeaks("Hi Sam, Command Bridge is online.");
    await saiSpeaks("SAI here. I am standing by for layout micro-fix tasks.");
  }

  function openBridgePanel() {
    const panel = document.getElementById("commandBridgePanel");
    if (!panel) return;
    panel.classList.remove("cb-panel-hidden");
    panel.classList.add("cb-panel-visible");
    initialBridgeGreetingIfEmpty();
  }

  function closeBridgePanel() {
    const panel = document.getElementById("commandBridgePanel");
    if (!panel) return;
    panel.classList.remove("cb-panel-visible");
    panel.classList.add("cb-panel-hidden");
  }

  // ========== DOM BINDINGS ==========
  document.addEventListener("DOMContentLoaded", () => {
    // SAI layout buttons
    const scanBtn = document.getElementById(ui.scanButtonId);
    const applyBtn = document.getElementById(ui.applyButtonId);
    const quickBtn = document.getElementById(ui.quickFixButtonId);

    if (scanBtn) scanBtn.onclick = () => SAI.scan();
    if (applyBtn) applyBtn.onclick = () => SAI.applyAll();
    if (quickBtn) quickBtn.onclick = () => SAI.applyAll();

    log("Synthetic AI ready.");

    // Command Bridge bindings
    const toggle = document.getElementById("commandBridgeToggle");
    const panel = document.getElementById("commandBridgePanel");
    const closeBtn = document.getElementById("cbClose");
    const sendBtn = document.getElementById("cbSend");
    const input = document.getElementById("cbInput");
    const applyFixesBtn = document.getElementById("cbApplyFixes");

    if (toggle && panel) {
      toggle.onclick = () => {
        const isHidden = panel.classList.contains("cb-panel-hidden");
        if (isHidden) {
          openBridgePanel();
        } else {
          closeBridgePanel();
        }
      };
    }

    if (closeBtn) {
      closeBtn.onclick = () => closeBridgePanel();
    }

    function handleSend() {
      if (!input) return;
      const value = input.value;
      input.value = "";
      handleUserInputToBridge(value);
    }

    if (sendBtn) sendBtn.onclick = handleSend;
    if (input) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleSend();
        }
      });
    }

    if (applyFixesBtn) {
      applyFixesBtn.onclick = async () => {
        await novaSpeaks("Nova: Sending a request to SAI to apply layout micro-fixes.");
        await saiSpeaks(
          "SAI: Applying micro-fixes now within incremental-only safety mode."
        );
        SAI.applyAll();
      };
    }
  });
})();
