class N8NChat extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.chatHasBeenOpened = false;
    this.wizzIntervalId = null;
    this.notificationTimer = null;
    this.notificationSound = null;

    this.n8nWebhookUrl =
      "https://n8n.compleo.dev/webhook/fd0cb5d1-4fa0-4144-9e31-6f4408e2d231/chat";

    // Bind context
    this.toggleChat = this.toggleChat.bind(this);
    this.closeChat = this.closeChat.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.onInputKeydown = this.onInputKeydown.bind(this);

    this.init();
  }

  async init() {
    await this.loadTemplate();
    this.cacheDom();
    this.initSessionAndMessages();
    this.setupUX();
  }

  async loadTemplate() {
    const [html, css] = await Promise.all([
      fetch("https://cdn.jsdelivr.net/gh/COMPLEOAGENCY/n8n-chat@v1.0.0/n8n.html").then(res => res.text()),
      fetch("https://cdn.jsdelivr.net/gh/COMPLEOAGENCY/n8n-chat@v1.0.0/dist/n8n.css").then(res => res.text())
    ]);

    const template = document.createElement("template");
    template.innerHTML = `<style>${css}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  cacheDom() {
    this.chatWindow = this.shadowRoot.getElementById("chatWindow");
    this.chatToggleBtn = this.shadowRoot.querySelector(".chat-toggle");
    this.notifBadge = this.shadowRoot.querySelector(".msg-notif");
    this.chatBody = this.shadowRoot.getElementById("chatBody");
    this.chatInput = this.shadowRoot.getElementById("chatInput");
    this.sendBtn = this.shadowRoot.querySelector(".chat-input button");
    this.closeBtn = this.shadowRoot.querySelector(".chat-close");
  }

  initSessionAndMessages() {
    this.initializeSession();
    this.loadPreviousMessages();
  }

  setupUX() {
    this.setupNotificationPreparation();
    this.setupDelayedNotification();
    this.setupFirstUserInteractionTrigger();
    this.setupListeners();
  }

  setupListeners() {
    this.chatToggleBtn?.addEventListener("click", this.toggleChat);
    this.closeBtn?.addEventListener("click", this.closeChat);
    this.sendBtn?.addEventListener("click", this.sendMessage);
    this.chatInput?.addEventListener("keydown", this.onInputKeydown);
  }

  disconnectedCallback() {
    clearInterval(this.wizzIntervalId);
    clearTimeout(this.notificationTimer);

    this.chatToggleBtn?.removeEventListener("click", this.toggleChat);
    this.closeBtn?.removeEventListener("click", this.closeChat);
    this.sendBtn?.removeEventListener("click", this.sendMessage);
    this.chatInput?.removeEventListener("keydown", this.onInputKeydown);
  }

  initializeSession() {
    if (!localStorage.getItem("n8n-session-id")) {
      localStorage.setItem("n8n-session-id", this.generateUUID());
    }
  }

  getSessionId() {
    return localStorage.getItem("n8n-session-id");
  }

  generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  setupNotificationPreparation() {
    this.shadowRoot.host.ownerDocument.addEventListener(
      "click",
      () => {
        this.playNotificationSoundOnce();
      },
      { once: true }
    );
  }

  playNotificationSoundOnce() {
    if (!this.notificationSound) {
      this.notificationSound = new Audio(
        "https://elasticbeanstalk-eu-west-2-459635205407.s3.dualstack.eu-west-2.amazonaws.com/n8n/notification.mp3"
      );

      this.notificationSound
        .play()
        .then(() => {
          this.notificationSound.pause();
          this.notificationSound.currentTime = 0;
        })
        .catch(console.warn);
    }
  }

  setupFirstUserInteractionTrigger() {
    const triggerNotification = () => {
      if (!this.chatHasBeenOpened && this.notifBadge) {
        this.notifBadge.classList.add("show");

        if (this.notificationSound) {
          try {
            const soundClone = this.notificationSound.cloneNode();
            soundClone.play().catch(console.warn);
          } catch (e) {
            console.warn("Erreur son :", e);
          }
        }
      }

      ["click", "scroll", "keydown", "touchstart"].forEach((evt) =>
        this.shadowRoot.host.ownerDocument.removeEventListener(
          evt,
          triggerNotification
        )
      );
    };

    ["click", "scroll", "keydown", "touchstart"].forEach((evt) =>
      this.shadowRoot.host.ownerDocument.addEventListener(
        evt,
        triggerNotification,
        { once: true }
      )
    );
  }

  setupDelayedNotification() {
    if (!this.notifBadge) return;

    clearTimeout(this.notificationTimer);
    this.notificationTimer = setTimeout(() => {
      if (this.chatHasBeenOpened) return;

      clearInterval(this.wizzIntervalId);
      this.wizzIntervalId = setInterval(() => {
        if (this.chatHasBeenOpened) {
          clearInterval(this.wizzIntervalId);
          this.chatToggleBtn.classList.remove("wizz-effect");
        } else {
          this.applyWizzEffect();
        }
      }, 10000);
    }, 3000);
  }

  applyWizzEffect() {
    if (this.chatToggleBtn && !this.chatHasBeenOpened) {
      this.chatToggleBtn.classList.add("wizz-effect");
      setTimeout(() => this.chatToggleBtn.classList.remove("wizz-effect"), 500);
    }
  }

  toggleChat() {
    const isOpen = this.chatWindow.classList.toggle("show");

    if (isOpen) {
      this.chatToggleBtn.style.display = "none";

      if (!this.chatHasBeenOpened) {
        this.chatHasBeenOpened = true;
        this.notifBadge?.classList.remove("show");
        this.notifBadge.style.display = "none";
      }

      clearInterval(this.wizzIntervalId);
      this.chatToggleBtn.classList.remove("wizz-effect");
    } else {
      this.chatToggleBtn.style.display = "";
    }
  }

  closeChat() {
    this.chatWindow.classList.remove("show");
    this.chatToggleBtn.style.display = "";
  }

  onInputKeydown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this.sendMessage();
    }
  }

  async sendMessage() {
    const messageText = this.chatInput.value.trim();
    if (!messageText) return;

    this.sendBtn.disabled = true;
    this.appendMessage("user", messageText);
    this.chatInput.value = "";

    const loadingId = "loading-" + Date.now();
    let typingTimeoutId;

    typingTimeoutId = setTimeout(() => {
      this.appendMessage("bot", "Émeline écrit", loadingId, true);
    }, 3000);

    try {
      const response = await fetch(this.n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sendMessage",
          sessionId: null,
          chatInput: messageText,
          metadata: { sessionId: this.getSessionId() },
        }),
      });

      const { output } = await response.json();

      clearTimeout(typingTimeoutId);

      this.removeMessageById(loadingId);
      this.appendMessage(
        "bot",
        output ||
          "Je suis désolée, je n'ai pas bien compris. Pouvez-vous reformuler ?"
      );
    } catch (err) {
      console.error("Erreur N8N :", err);
      clearTimeout(typingTimeoutId);
      this.removeMessageById(loadingId);
      this.appendMessage(
        "bot",
        "Une erreur est survenue avec le serveur. Veuillez réessayer plus tard."
      );
    } finally {
      this.sendBtn.disabled = false;
    }
  }

  async loadPreviousMessages() {
    const sessionId = this.getSessionId();

    try {
      const response = await fetch(this.n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "loadPreviousSession",
          sessionId: null,
          metadata: { sessionId },
        }),
      });

      const { data: history } = await response.json();

      if (Array.isArray(history) && history.length > 0) {
        history.forEach((entry) => {
          const role = entry.id.includes("HumanMessage") ? "user" : "bot";
          const text = entry.kwargs?.content || "";
          if (text) this.appendMessage(role, text);
        });
      } else {
        this.showWelcomeMessages();
      }
    } catch (err) {
      console.error("Erreur chargement historique :", err);
      this.showWelcomeMessages();
    } finally {
      this.scrollChatToBottom();
    }
  }

  showWelcomeMessages() {
    this.appendMessage(
      "bot",
      "Bonjour, je m'appelle Émeline experte travaux chez je rénove."
    );
    this.appendMessage("bot", "Comment puis-je vous aider ?");
  }

  appendMessage(role, text, id = null, isTyping = false) {
    const wrapper = document.createElement("div");
    wrapper.className = "chat-message-content";
    if (id) wrapper.id = id;

    const message = this.createMessageElement(role, text, isTyping);
    wrapper.appendChild(message);
    this.chatBody.appendChild(wrapper);

    this.scrollChatToBottom();
  }

  createMessageElement(role, text, isTyping = false) {
    const message = document.createElement("div");
    message.className = `chat-message ${role}`;

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
      msgText.innerHTML = this.escapeHtml(text);
      message.appendChild(msgText);
    }

    const triangle = document.createElement("div");
    triangle.className = "triangle";
    message.appendChild(triangle);

    return message;
  }

  removeMessageById(id) {
    const el = this.shadowRoot.getElementById(id);
    if (el) el.remove();
  }

  scrollChatToBottom() {
    this.chatBody.scrollTo({
      top: this.chatBody.scrollHeight,
      behavior: "smooth",
    });
  }

  escapeHtml(texte) {
    return texte
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
      .replace(/\n/g, "<br>");
  }
}

customElements.define("n8n-chat", N8NChat);
