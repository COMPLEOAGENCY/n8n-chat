// 🧠 État global du chat
let chatHasBeenOpened = false;
let wizzIntervalId = null;
let notificationTimer = null;
let notificationSound = null;

document.addEventListener("DOMContentLoaded", () => {
  initializeSession();
  loadPreviousMessages();
  setupNotificationPreparation();
  setupDelayedNotification();
  setupFirstUserInteractionTrigger();
});

// 🟢 Initialisation du son en amont (préparation silencieuse)
function setupNotificationPreparation() {
  document.addEventListener("click", () => {
    if (!notificationSound) {
      notificationSound = new Audio("audio/notification.mp3");
      notificationSound.play().then(() => {
        notificationSound.pause();
        notificationSound.currentTime = 0;
      }).catch((e) => {
        console.warn("Préchargement du son impossible :", e);
      });
    }
  }, { once: true });
}

// 👂 Premier événement utilisateur déclenche la notif visuelle/sonore
function setupFirstUserInteractionTrigger() {
  const notifBadge = document.querySelector(".chat-toggle .msg-notif");

  const triggerNotification = () => {
    if (!chatHasBeenOpened && notifBadge) {
      notifBadge.classList.add("show");

      if (notificationSound) {
        try {
          const soundClone = notificationSound.cloneNode();
          soundClone.play().catch(console.warn);
        } catch (e) {
          console.warn("Erreur son :", e);
        }
      }
    }

    ["click", "scroll", "keydown", "touchstart"].forEach(evt =>
      window.removeEventListener(evt, triggerNotification)
    );
  };

  ["click", "scroll", "keydown", "touchstart"].forEach(evt =>
    window.addEventListener(evt, triggerNotification, { once: true })
  );
}

// 🔄 Animation périodique du bouton
function setupDelayedNotification() {
  const notifBadge = document.querySelector(".chat-toggle .msg-notif");
  if (!notifBadge) return;

  clearTimeout(notificationTimer);
  notificationTimer = setTimeout(() => {
    if (chatHasBeenOpened) return;

    clearInterval(wizzIntervalId);
    wizzIntervalId = setInterval(() => {
      if (chatHasBeenOpened) {
        clearInterval(wizzIntervalId);
        wizzIntervalId = null;
        document.querySelector(".chat-toggle")?.classList.remove("wizz-effect");
      } else {
        applyWizzEffect();
      }
    }, 10000);
  }, 3000);
}

function applyWizzEffect() {
  const chatToggle = document.querySelector(".chat-toggle");
  if (chatToggle && !chatHasBeenOpened) {
    chatToggle.classList.add("wizz-effect");
    setTimeout(() => chatToggle.classList.remove("wizz-effect"), 500);
  }
}

// 💬 Toggle d'ouverture du chat
function toggleChat() {
  const chatWindow = document.getElementById("chatWindow");
  const chatToggleBtn = document.querySelector(".chat-toggle");
  const notifBadge = chatToggleBtn?.querySelector(".msg-notif");

  const isOpen = chatWindow.classList.toggle("show");

  if (isOpen) {
    chatToggleBtn.style.display = "none";

    if (!chatHasBeenOpened) {
      chatHasBeenOpened = true;
      notifBadge?.classList.remove("show");
      notifBadge.style.display = "none";
    }

    clearInterval(wizzIntervalId);
    wizzIntervalId = null;
    chatToggleBtn.classList.remove("wizz-effect");

  } else {
    chatToggleBtn.style.display = "";
  }
}

function closeChat() {
  document.getElementById("chatWindow")?.classList.remove("show");
  document.querySelector(".chat-toggle").style.display = "";
}

// 📤 Envoi de message utilisateur
async function sendMessage() {
  const input = document.getElementById("chatInput");
  const messageText = input.value.trim();
  if (!messageText) return;

  const sendButton = document.querySelector(".chat-input button");
  sendButton.disabled = true;

  appendMessage("user", messageText);
  input.value = "";

  const loadingId = "loading-" + Date.now();
  setTimeout(() => {
    appendMessage("bot", "Émeline écrit", loadingId, true);
  }, 3000);

  try {
    const response = await fetch("https://n8n.compleo.dev/webhook/fd0cb5d1-4fa0-4144-9e31-6f4408e2d231/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "sendMessage",
        sessionId: null,
        chatInput: messageText,
        metadata: { sessionId: getSessionId() }
      }),
    });

    const { output } = await response.json();
    removeMessageById(loadingId);
    appendMessage("bot", output || "Je suis désolée, je n'ai pas bien compris. Pouvez-vous reformuler ?");
  } catch (err) {
    console.error("Erreur N8N :", err);
    removeMessageById(loadingId);
    appendMessage("bot", "Une erreur est survenue avec le serveur. Veuillez réessayer plus tard.");
  } finally {
    sendButton.disabled = false;
  }
}

// 📥 Chargement historique
async function loadPreviousMessages() {
  const sessionId = getSessionId();
  const body = document.getElementById("chatBody");

  try {
    const response = await fetch("https://n8n.compleo.dev/webhook/fd0cb5d1-4fa0-4144-9e31-6f4408e2d231/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "loadPreviousSession",
        sessionId: null,
        metadata: { sessionId }
      }),
    });

    const { data: history } = await response.json();

    if (Array.isArray(history) && history.length > 0) {
      history.forEach(entry => {
        const role = entry.id.includes("HumanMessage") ? "user" : "bot";
        const text = entry.kwargs?.content || "";
        if (text) appendMessage(role, text);
      });
    } else {
      showWelcomeMessages();
    }
  } catch (err) {
    console.error("Erreur chargement historique :", err);
    showWelcomeMessages();
  } finally {
    body.scrollTo({ top: body.scrollHeight, behavior: "smooth" });
  }
}

function showWelcomeMessages() {
  appendMessage("bot", "Bonjour, je m'appelle Émeline experte travaux chez je rénove.");
  appendMessage("bot", "Comment puis-je vous aider ?");
}

// ➕ Ajout message dans le DOM
function appendMessage(role, text, id = null, isTyping = false) {
  const body = document.getElementById("chatBody");

  const wrapper = document.createElement("div");
  wrapper.className = "chat-message-content";
  if (id) wrapper.id = id;

  const message = document.createElement("div");
  message.className = `chat-message ${role}`;
  const triangle = document.createElement("div");
  triangle.className = "triangle";

  if (isTyping) {
    message.classList.add("typing-indicator");
    const span = document.createElement("span");
    span.className = "typing-text";
    span.textContent = text;
    const dots = document.createElement("span");
    dots.className = "dots";
    dots.innerHTML = "<span>.</span><span>.</span><span>.</span>";
    message.append(span, dots);
  } else {
    const msgText = document.createElement("div");
    msgText.className = "message-text-content";
    msgText.textContent = text;
    message.appendChild(msgText);
  }

  message.appendChild(triangle);
  wrapper.appendChild(message);
  body.appendChild(wrapper);
  body.scrollTo({ top: body.scrollHeight, behavior: "smooth" });
}

function removeMessageById(id) {
  document.getElementById(id)?.remove();
}

// 🧠 Session utilisateur
function initializeSession() {
  if (!localStorage.getItem("n8n-session-id")) {
    localStorage.setItem("n8n-session-id", generateUUID());
  }
}

function getSessionId() {
  return localStorage.getItem("n8n-session-id");
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
