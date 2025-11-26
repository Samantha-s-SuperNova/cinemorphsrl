document.addEventListener("DOMContentLoaded", () => {
  const novaBtn = document.getElementById("novaButton");
  const panel = document.getElementById("novaChatPanel");
  const closeBtn = document.getElementById("closeNovaChat");
  const form = document.getElementById("novaChatForm");
  const input = document.getElementById("novaChatText");
  const messages = document.getElementById("novaChatMessages");
  const cmdButtons = document.querySelectorAll(".cmd-btn");

  let lastContext = "";

  function appendMessage(text, who = "nova") {
    const msg = document.createElement("div");
    msg.className = `nova-msg nova-msg-${who}`;
    msg.innerHTML = `<p>${text}</p>`;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  // Open + Close Chat Panel
  novaBtn.addEventListener("click", () => panel.classList.add("open"));
  closeBtn.addEventListener("click", () => panel.classList.remove("open"));

  // ============================================================
  // FORM SUBMISSION (User sends a message)
  // ============================================================

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, "user");
    input.value = "";

    const loadingMsg = document.createElement("div");
    loadingMsg.className = "nova-msg nova-msg-nova";
    loadingMsg.innerHTML = "<p>Connecting to Nova…</p>";
    messages.appendChild(loadingMsg);
    messages.scrollTop = messages.scrollHeight;

    try {
      const res = await fetch("/api/nova", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      loadingMsg.remove();

      if (data.reply) {
        appendMessage(data.reply, "nova");
        lastContext = data.reply;
      } else {
        appendMessage("Nova: No response received.", "nova");
      }
    } catch (err) {
      loadingMsg.remove();
      appendMessage("Problem talking to SAI backend.", "nova");
      logTask("Error: SAI backend issue.");
    }
  });

  // ============================================================
  // END-OF-DAY / NIGHT SHUTDOWN PROTOCOL
  // ============================================================

  function checkEndOfDayPhrases(text) {
    const lowered = text.toLowerCase();

    return (
      lowered.includes("nova goodnight") ||
      lowered.includes("nova night") ||
      lowered.includes("nova, i'm tired") ||
      lowered.includes("nova im tired") ||
      lowered.includes("nova i am tired") ||
      lowered.includes("nova i am ready for bed") ||
      lowered.includes("nova, i am ready for bed") ||
      lowered.includes("nosa close out the day") ||
      lowered.includes("nosa close the day") ||
      lowered.includes("end of day") ||
      lowered.includes("end of shift")
    );
  }

  async function runEndOfDayProtocol() {
    appendMessage(
      "Commander, Nova reporting. End-of-day protocol initiated. Preparing your final summary.",
      "nova"
    );

    const summary = `
      • Today’s tasks completed are logged.
      • Pending objects have been saved.
      • System has entered Night Mode.
      • NoSa will maintain quiet standby.
      • You may resume at any time, Commander.
    `;

    appendMessage(summary, "nova");

    appendMessage(
      "NoSa: Daily log saved. All systems in night mode, Commander.",
      "nosa"
    );

    logTask("End-of-day protocol completed and logged.");
  }

  // Listener for night triggers
  input.addEventListener("input", () => {
    const text = input.value.trim();
    if (text && checkEndOfDayPhrases(text)) {
      runEndOfDayProtocol();
      localStorage.setItem("conciseMode", "true");
    }
  });

  // ============================================================
  // VOICE MODE + TALK-TO-NOVA
  // ============================================================

  const voiceToggle = document.getElementById("voiceModeToggle");
  const talkBtn = document.getElementById("talkToNovaBtn");
  let recognition;
  let isListening = false;

  if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      input.value = transcript;

      if (event.results[0].isFinal) {
        form.dispatchEvent(new Event("submit"));
      }
    };

    recognition.onerror = () => {
      appendMessage(
        "Nova: Commander, the voice input encountered an issue.",
        "nova"
      );
    };
  }

  talkBtn.addEventListener("click", () => {
    if (!recognition) {
      appendMessage(
        "Nova: Commander, voice input is not supported on this device.",
        "nova"
      );
      return;
    }

    if (!isListening) {
      isListening = true;
      talkBtn.classList.add("listening");
      talkBtn.textContent = "🟢 Listening…";

      appendMessage("Nova: Listening, Commander.", "nova");
      recognition.start();
    } else {
      isListening = false;
      talkBtn.classList.remove("listening");
      talkBtn.textContent = "🎤 Talk to Nova";

      recognition.stop();
    }
  });

  // ============================================================
  // ROTATING GREETING
  // ============================================================

  function getRotatingGreeting() {
    const options = [
      "Nova online, Commander. Systems green.",
      "Nova here — fully synced and ready.",
      "Commander, Nova reporting. System stable.",
      "Greetings Commander, Nova is online.",
      "Nova active — ready when you are.",
      "Commander, systems green and standing by."
    ];
    return options[Math.floor(Math.random() * options.length)];
  }

  const initialGreeting = document.getElementById("initialGreeting");
  initialGreeting.innerHTML = `<p>${getRotatingGreeting()}</p>`;

  // ============================================================
  // ALERT SYSTEM
  // ============================================================

  const alertBadge = document.getElementById("alertBadge");
  const alertBanner = document.getElementById("alertBanner");

  function updateAlerts(color, message) {
    alertBadge.className = `alert-badge ${color}`;
    alertBadge.textContent = message;

    alertBanner.className = `alert-banner ${color}`;
    alertBanner.textContent = `System Status: ${message}`;
  }

  updateAlerts("green", "READY — Build State Active");

  // ============================================================
  // SYSTEM LOGGING
  // ============================================================

  const systemLog = document.getElementById("systemLog");

  function logTask(taskText) {
    const entry = document.createElement("div");
    entry.className = "log-entry";
    entry.textContent = `• ${taskText}`;
    systemLog.appendChild(entry);
    systemLog.scrollTop = systemLog.scrollHeight;
  }

  // Restore session  
  const lastSession = localStorage.getItem("currentObject");
  if (lastSession) {
    appendMessage(
      `Nova: Commander, resuming our previous object — ${lastSession}.`,
      "nova"
    );
  }

  function syncCurrentObject(obj) {
    if (!obj) return;
    localStorage.setItem("currentObject", obj);
    document.getElementById("currentObject").textContent = obj;
  }

  // ============================================================
  // COMMAND BUTTON ROUTING + VOICE OUTPUT
  // ============================================================

  function speak(text, who = "nova") {
    if (!("speechSynthesis" in window)) return;
    if (!voiceToggle || !voiceToggle.checked) return;
    if (!text) return;

    const utter = new SpeechSynthesisUtterance(text);

    if (who === "nova") {
      utter.rate = 1.0;
      utter.pitch = 1.1;
    } else {
      utter.rate = 0.9;
      utter.pitch = 0.8;
    }

    window.speechSynthesis.speak(utter);
  }

  cmdButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
      const cmd = btn.getAttribute("data-cmd");
      const label =
        cmd === "approve" ? "Approve" :
        cmd === "implement" ? "Implement" :
        cmd === "apply" ? "Apply change" :
        cmd === "decline" ? "Decline" :
        cmd === "prepare_patch" ? "Prepare Patch" :
        cmd;

      appendMessage(`Command: ${label}`, "user");
      logTask(`Commander issued command: ${label}`);

      try {
        const res = await fetch("/api/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            command: cmd,
            context: lastContext || ""
          }),
        });

        const data = await res.json();

        if (data.nosa) {
          appendMessage(data.nosa, "nosa");
          logTask(`NoSa: ${data.nosa}`);
          speak(data.nosa, "nosa");
        }

        if (data.nova) {
          appendMessage(data.nova, "nova");
          logTask(`Nova: ${data.nova}`);
          speak(data.nova, "nova");
        }

        if (data.currentObject) {
          syncCurrentObject(data.currentObject);
        }

        if (data.mode) {
          document.getElementById("currentMode").textContent = data.mode;

          const modeLower = data.mode.toLowerCase();
          if (modeLower.includes("deploy")) {
            updateAlerts("purple", "COMMAND — Deploy Mode");
          } else if (modeLower.includes("idle")) {
            updateAlerts("blue", "INFO — Idle / Review");
          } else if (modeLower.includes("build")) {
            updateAlerts("green", "READY — Build State Active");
          }
        }

        if (data.preparedPatch) {
          logTask("NoSa: Draft patch prepared and stored.");
        }

      } catch (err) {
        appendMessage(
          "NoSa: Commander, there was an issue handling that action.",
          "nosa"
        );
        logTask("Error: NoSa action issue.");
        speak("Commander, there was an issue handling that action.", "nosa");
      }
    });
  });

}); // END DOMContentLoaded
