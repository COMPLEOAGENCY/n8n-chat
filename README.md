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

1. Clone or download this repository.
2. Copy the following folders and files into your project:
   - `index.html`
   - `css/style.css`
   - `js/chat.js`
   - `js/toggle.js`
   - `js/enter.js`
   - `images/` folder (for icons and branding)
   - `audio/notification.mp3` (notification sound)

3. Replace the webhook URL in `chat.js`:

```javascript
const response = await fetch("https://your-n8n-instance/webhook/your-endpoint/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    action: "sendMessage",
    sessionId: null,
    chatInput: messageText,
    metadata: { sessionId: getSessionId() }
  }),
});
```
4. Embed the widget in any HTML page or load it via `<iframe>` if needed.

---

## 🔧 Configuration

You can customize:

- **Avatar:** in the HTML (`logo_playmo.png`)  
- **Assistant name:** change "Emeline" to your agent's name  
- **Welcome messages:** in `chat.js` → `showWelcomeMessages()`  
- **Webhook endpoint:** in the fetch call inside `chat.js`  
- **UI design:** edit `css/style.css`  

---

## 🧩 Embed in External Sites

You can embed the widget via an iframe:

```html
<iframe src="https://yourdomain.com/n8n-chat.html" width="400" height="600" style="border: none;"></iframe>
```
Or inject it directly into the DOM as a component if integrated into your own app.
---

## 🧠 Dependencies

This project is built with:

- Vanilla JS (no frameworks)  
- CSS3  
- An n8n backend to process and respond to messages via webhook  

---

## 📦 Future Improvements

- ✨ Web Component or NPM packaging  
- 🌐 i18n support (multi-language)  
- 💬 Real-time capabilities via WebSocket  
- 🧾 Chat transcript download/export  

---

## 📄 License

MIT License. Free to use and modify. Attribution appreciated but not required.

---

## 🙋‍♀️ About

Developed for Je-Rénove to provide a lightweight customer support experience using n8n.

## 📘 File-by-File Documentation

### 📄 `index.html`

**Purpose**: Main structure of the chat widget, containing:

- The floating chat bubble  
- The chat window (header, body, input)  
- Linked scripts and resources  

**Snippet**:
```html
<button class="chat-toggle" onclick="toggleChat()">
  ...
</button>

<div class="chat-window" id="chatWindow">
  ...
</div>
```

### 📄 `js/chat.js`

**Purpose**: Core logic for:

- Sending/receiving messages  
- Displaying loading indicators  
- Managing session (via `localStorage`)  
- Fetching message history from n8n  
- Playing sounds  

**Key Function**:
```javascript
async function sendMessage() {
  ...
  const response = await fetch("https://...", {
    ...
    body: JSON.stringify({
      action: "sendMessage",
      chatInput: messageText,
      metadata: { sessionId: getSessionId() }
    }),
  });
  ...
}
```

### 📄 `js/enter.js`

**Purpose**: Enables sending messages by pressing **Enter** (without **Shift**).

**Code**:
```javascript
document.getElementById("chatInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
```

### 📄 `js/toggle.js`

**Purpose**: Opens or closes the chat interface.

**Code**:
```javascript
function toggleChat() {
  document.getElementById("chatWindow").classList.add("show");
  document.querySelector(".chat-toggle").style.display = "none";
}

function closeChat() {
  document.getElementById("chatWindow").classList.remove("show");
  document.querySelector(".chat-toggle").style.display = "block";
}
```

### 🎨 `css/style.css`

**Purpose**: Handles all UI styling, including:

- Button and chat layout  
- Responsive display  
- Animations and effects  
- Custom colors, spacing, and fonts  

💡 *You can modify this file to customize the theme and layout of the widget.*
