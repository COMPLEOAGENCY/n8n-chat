# N8N-Chat Widget

A lightweight, embeddable chat widget built in vanilla JavaScript and HTML/CSS. Designed to communicate with an [n8n](https://n8n.io) workflow via a public webhook. Ideal for integrating basic customer support or automation agents directly into your website.

---

## 🚀 Features

- 🗨️ Interactive chat bubble UI
- 🔊 Notification sounds & animations
- 💾 Session persistence using `localStorage`
- 📩 Seamless integration with n8n via Webhook (POST)
- 🧠 Welcome messages and typing indicator
- 📜 Message history loading from n8n workflow
- ⚡ Send messages with Enter key or button click
- 📱 Fully responsive design

---

## 🛠️ Installation

### Option 1 : Local utilisation

1. Clone or download this repository.
2. Copy the following folders and files into your project:

   - `n8n.html`
   - `dist/n8n.css`
   - `dist/n8n-chat-widget.js`

3. Add your assets:

   - `dist/audio/notify.mp3` – or provide a direct URL to your own notification sound
   - `dist/images/logo_playmo.png` – or use your own avatar/logo image

   > 🗂️ **Note**: In this project, audio and image files are hosted externally on S3.  
   > You can either do the same (use direct links in the code), or place them in local `audio/` and `images/` folders within your project and update the paths accordingly.

4. Replace the webhook URL in `n8n-chat-widget.js` (or use environment variables/config to customize).

```javascript
const response = await fetch(
  "https://your-n8n-instance/webhook/your-endpoint/chat",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "sendMessage",
      sessionId: null,
      chatInput: messageText,
      metadata: { sessionId: getSessionId() },
    }),
  }
);
```

---

### Option 2 : Using CDN (recommended for easy integration)

Instead of hosting files locally, you can load the widget assets directly from jsDelivr CDN.

Example:

```html
<n8n-chat></n8n-chat>
<script src="https://cdn.jsdelivr.net/gh/COMPLEOAGENCY/n8n-chat@v1.0.4/dist/n8n-chat-widget.js"></script>
```

⚠️ Make sure to update webhook URLs inside the JS if needed, or configure your n8n backend to accept requests accordingly.
This method avoids manual hosting and simplifies updates by just changing the version number in the CDN URL.

---

## 🔧 Configuration

**Note:**  
 When using the CDN, if you need to update the webhook URL or other settings in `n8n-chat-widget.js`, you can either:

- Fork and customize the repo then publish your own version on CDN, or
- Host a small config script locally to override settings after loading the widget script.

You can customize:

- **Avatar:** in the HTML (`logo_playmo.png`)
- **Assistant name:** change "Emeline" to your agent's name
- **Welcome messages:** in `n8n-chat-widget.js` → `showWelcomeMessages()`
- **Webhook endpoint:** in the fetch call inside `n8n-chat-widget.js`
- **UI design:** edit `n8n.css`

---

## 🧩 Embedding Options

### You can embed the widget in two ways:

- **Standard HTML Local integration:**

  ```html
  <n8n-chat></n8n-chat>
  <script src="your/path/to/n8n-chat-widget.js"></script>
  ```

- **Standard CDN integration:**
  ```html
  <n8n-chat></n8n-chat>
  <script src="https://cdn.jsdelivr.net/gh/COMPLEOAGENCY/n8n-chat@v1.0.4/dist/n8n-chat-widget.js"></script>
  ```

## Or inject with CDN

---

## 🧠 Dependencies

This project is built with:

- Vanilla JS (no frameworks, no dependencies)
- CSS3
- An n8n backend to process and respond to messages via webhook

---

## 📦 Future Improvements

- ✨ Web Component
- 🌐 i18n support (multi-language)
- 💬 Real-time capabilities via WebSocket
- 🧾 Chat transcript download/export

---

## 🙋‍♀️ About

Developed for Je-Rénove to provide a lightweight customer support experience using n8n.

## 📘 File-by-File Documentation

### 📄 `index.html`

**Purpose**: Defines the structure of the chat widget, including:

- The floating chat bubble (`.chat-toggle`)
- The main chat window (`#chatWindow`) with header, body, and input area
- Script and CSS links

**Snippet**:

```html
<button class="chat-toggle" onclick="toggleChat()">...</button>
<div class="chat-window" id="chatWindow">...</div>
```

### 📄 `n8n-chat-widget.js`

**Purpose**: Contains all widget logic, such as:

- Message sending and receiving (via `fetch` to your n8n webhook)
- Typing indicator and loading states
- Session management using `localStorage`
- Auto-scroll, sound notification, message rendering
- Toggle chat UI (`toggleChat()` / `closeChat()`)
- Keyboard support: send message with **Enter** (unless **Shift** is held)

**Key Snippets**:

```javascript
async function sendMessage() {
  const response = await fetch("https://...", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "sendMessage",
      chatInput: messageText,
      metadata: { sessionId: getSessionId() },
    }),
  });
  // handle response...
}

document.getElementById("chatInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

function toggleChat() {
  document.getElementById("chatWindow").classList.add("show");
  document.querySelector(".chat-toggle").style.display = "none";
}

function closeChat() {
  document.getElementById("chatWindow").classList.remove("show");
  document.querySelector(".chat-toggle").style.display = "block";
}
```

### 🎨 `n8n.css`

**Purpose:** Controls the widget's look and feel:

- Floating button styles and layout
- Responsive design (mobile/tablet/desktop)
- Color themes, fonts, spacing, and animations
- Chat window transitions and message formatting

💡 _Customize this file to match your site's branding._

## 💡 Bonus

- ![License](https://img.shields.io/badge/license-MIT-green)
- 🔗 [Live Demo](https://clubtravaux.com)

---

## 📄 License

MIT License. Free to use and modify. Attribution appreciated but not required.
