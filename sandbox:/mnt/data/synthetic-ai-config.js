(function () {
  window.SYNTHETIC_AI_CONFIG = {
    version: "1.0.0",
    mode: "incremental-only",
    fences: {
      requireOptInAttribute: "data-sai",
      allowedScopes: ["portal", "work-env", "layout"],
      protectedAttribute: "data-protected"
    },
    ui: {
      logElementId: "syntheticAiLog",
      scanButtonId: "saiScanBtn",
      applyButtonId: "saiApplyBtn",
      quickFixButtonId: "saiQuickFixBtn"
    },
    rules: [
      { id: "normalize-portal-cards", label: "Normalize portal card sizes", scope: "portal" },
      { id: "normalize-work-env-cards", label: "Normalize work environment", scope: "work-env" },
      { id: "tighten-layout-gaps", label: "Tighten layout gaps", scope: "layout" }
    ]
  };
})();
