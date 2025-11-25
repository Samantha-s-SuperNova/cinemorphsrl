document.addEventListener("DOMContentLoaded", () => {
  
  const novaBtn = document.getElementById("novaButton");
  const panel = document.getElementById("novaChatPanel");
  const closeBtn = document.getElementById("closeNovaChat");
  const form = document.getElementById("novaChatForm");
  const input = document.getElementById("novaChatText");
  const messages = document.getElementById("novaChatMessages");

  // OPEN CHAT
  function openPanel() {
    panel.classList.add("open");
    input && input.focus();
  }

  // CLOSE CHAT
  function closePanel() {
    panel.classList.remove("open");
  }

  // TRIGGERS
  novaBtn.addEventListener("click", openPanel);
  closeBtn.addEventListener("click", closePanel);

  // MESSAGE HANDLING
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    // user bubble
    const userMsg = document.createElement("div");
    userMsg.className = "nova-msg nova-msg-user";
    userMsg.innerHTML = `<p>${text}</p>`;
    messages.appendChild(userMsg);

    input.value = "";
    messages.scrollTop = messages.scrollHeight;

    // placeholder Nova reply
    const novaMsg = document.createElement("div");
    novaMsg.className = "nova-msg nova-msg-nova";
    novaMsg.innerHTML = `<p>SAI placeholder response. Backend coming next.</p>`;
    messages.appendChild(novaMsg);

    messages.scrollTop = messages.scrollHeight;
  });
});
