// Synthetic AI — Incremental Update Engine
// Safe mode: Only small fixes. Only runs when you click a button.

(function () {
  const config = window.SYNTHETIC_AI_CONFIG || {};
  const fences = config.fences || {};
  const uiCfg = config.ui || {};

  const LOG_PREFIX = "[SyntheticAI] ";

  function log(msg) {
    const full = LOG_PREFIX + msg;
    console.log(full);

    const el = document.getElementById(uiCfg.logElementId);
    if (el) {
      const line = document.createElement("div");
      line.textContent = full;
      el.appendChild(line);
      el.scrollTop = el.scrollHeight;
    }
  }

  function isProtected(el) {
    return fences.protectedAttribute &&
           el.hasAttribute(fences.protectedAttribute);
  }

  function isAllowed(el, scope) {
    if (!el.hasAttribute(fences.requireOptInAttribute)) return false;
    const val = el.getAttribute(fences.requireOptInAttribute);
    if (!fences.allowedScopes.includes(val)) return false;
    if (scope && val !== scope) return false;
    return true;
  }

  // ================= RULES (MICRO FIXES ONLY) =================

  function normalizePortalCards() {
    const items = [...document.querySelectorAll("[data-sai='portal']")]
      .filter(el => !isProtected(el));

    if (!items.length) return null;

    return {
      id: "normalize-portal-cards",
      label: "Normalize portal cards",
      apply() {
        items.forEach(card => {
          card.style.display = "flex";
          card.style.alignItems = "center";
          card.style.justifyContent = "space-between";
          card.style.minWidth = "220px";
          card.style.maxWidth = "220px";
          card.style.minHeight = "80px";
          card.style.padding = "0.75rem 1rem";
        });
      }
    };
  }

  function normalizeWorkEnvCards() {
    const items = [...document.querySelectorAll("[data-sai='work-env']")]
      .filter(el => !isProtected(el));

    if (!items.length) return null;

    return {
      id: "normalize-work-env",
      label: "Normalize work environment tiles",
      apply() {
        items.forEach(card => {
          card.style.display = "flex";
          card.style.alignItems = "center";
          card.style.justifyContent = "space-between";
          card.style.minHeight = "48px";
          card.style.padding = "0.5rem 0.75rem";
          card.style.fontSize = "0.95rem";
        });
      }
    };
  }

  function tightenLayoutGaps() {
    const items = [...document.querySelectorAll("[data-sai='layout']")]
      .filter(el => !isProtected(el));

    if (!items.length) return null;

    return {
      id: "tighten-layout-gaps",
      label: "Tighten layout gaps",
      apply() {
        items.forEach(area => {
          area.style.display = "flex";
          area.style.flexDirection = "column";
          area.style.rowGap = "0.35rem";
        });
      }
    };
  }

  function collect() {
    return [
      normalizePortalCards(),
      normalizeWorkEnvCards(),
      tightenLayoutGaps()
    ].filter(Boolean);
  }

  const SyntheticAI = {
    scan() {
      log("Scan requested.");
      const fixes = collect();
      if (!fixes.length) {
        log("No fixes found.");
      } else {
        fixes.forEach(f => log("Found: " + f.label));
      }
      return fixes;
    },

    applyAll() {
      if (config.mode !== "incremental-only") {
        log("Blocked: not in incremental-only mode.");
        return;
      }

      const fixes = this.scan();
      if (!fixes.length) return;

      log("Applying fixes...");
      fixes.forEach(f => {
        try { f.apply(); log("Applied: " + f.label); }
        catch (e) { log("Error: " + e.message); }
      });

      log("Done.");
    }
  };

  window.SyntheticAI = SyntheticAI;

  // ================= UI =================

  function bindUI() {
    const scan = document.getElementById(uiCfg.scanButtonId);
    const apply = document.getElementById(uiCfg.applyButtonId);
    const quick = document.getElementById(uiCfg.quickFixButtonId);

    if (scan) scan.onclick = () => SyntheticAI.scan();
    if (apply) apply.onclick = () => SyntheticAI.applyAll();
    if (quick) quick.onclick = () => SyntheticAI.applyAll();

    log("Synthetic AI ready. Idle until you click.");
  }

  document.addEventListener("DOMContentLoaded", bindUI);
})();

