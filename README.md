# 💬 N8N Chat Widget

A lightweight, responsive, and customizable chat widget built with Vanilla JS + HTML/CSS.  
Allows connecting a website to an **n8n workflow** via a **public webhook**.

---

## 🚀 Features

- ✅ Encapsulated web component (`<n8n-chat>`)
- 🔄 Direct communication with n8n via webhook (JSON POST)
- 🧠 Customizable welcome message
- 🧑‍💼 Dynamic bot name + brand name
- 🎨 Fully themeable via HTML attributes
- 🔊 Sound notifications
- 💾 Session saved via `localStorage`
- ⌨️ Send messages with Enter key or button click
- 📱 Mobile and desktop responsive
- ♿️ Accessibility (ARIA)

---

## ⚙️ Quick Integration (via CDN)

Simply add this to your HTML:

```html
<n8n-chat></n8n-chat>

<script
  src="https://cdn.jsdelivr.net/gh/COMPLEOAGENCY/n8n-chat@v1.1.1/dist/n8n-chat-widget.js"
  data-webhook-url="https://n8n.compleo.dev/webhook/xxxxxxxx/chat"
  data-brand="Je-rénove"
  data-bot-name="Émeline"
  data-brand-logo-url="https://cdn.jsdelivr.net/gh/COMPLEOAGENCY/n8n-chat@v1.1.1/dist/images/logo_playmo.png"
  data-pills-color="linear-gradient(to bottom right, #20c997, #2a41e8)"
  data-toggle-text="#FFFFFF"
  data-chat-header="linear-gradient(to right, #20c997, #2a41e8)"
  data-bubble-user-color="#20c997"
  data-bubble-bot-color="#2a41e8"
  defer
></script>
````
## 🧩 Customizable Attributes (`data-*`)

| Attribute                | Description                                       | Example                                                                 |
|--------------------------|-------------------------------------------------|-------------------------------------------------------------------------|
| `data-webhook-url`       | Public URL of your n8n webhook                   | `https://n8n.yourserver.com/webhook/xyz`                               |
| `data-brand`             | Company name displayed                            | `Je-rénove`                                                             |
| `data-bot-name`          | Bot name shown in the header and welcome message| `Émeline`                                                               |
| `data-brand-logo-url`    | Logo displayed in the chat bubble and header     | `https://.../logo.png`                                                  |
| `data-pills-color`       | Color of the open button (gradient allowed)      | `linear-gradient(to bottom right, #20c997, #2a41e8)`                   |
| `data-toggle-text`       | Color of the text on the open button              | `#FFFFFF`                                                               |
| `data-chat-header`       | Background of the chat header                      | `linear-gradient(to right, #20c997, #2a41e8)`                          |
| `data-bubble-user-color` | Color of user message bubbles                      | `#20c997`                                                               |
| `data-bubble-bot-color`  | Color of bot message bubbles                       | `#2a41e8`                                                               |

> 🧠 **Note**: If an attribute is missing, a default value will be applied.

---

## 🎨 Theme (via dynamic CSS variables)

The widget dynamically injects a `<style>` block with the following CSS variables:

```css
:root {
  --pills-color: ...;
  --toggle-text: ...;
  --chat-header: ...;
  --bubble-user-color: ...;
  --bubble-bot-color: ...;
}
````
These values are automatically derived from the data-* attributes on the script tag if provided.

## 💡 Minimal Example

```html
<n8n-chat></n8n-chat>

<script
  src="https://cdn.jsdelivr.net/gh/COMPLEOAGENCY/n8n-chat@v1.1.1/dist/n8n-chat-widget.js"
  data-webhook-url="https://n8n.mysite.com/webhook/xyz"
  data-brand="MyCompany"
  data-bot-name="Alex"
  defer
></script>
````

## 🧠 How It Works

- The floating button triggers the chat window to open.
- Each user message is sent via `POST` to your configured **n8n webhook URL**.
- The n8n workflow responds with JSON in the following format:

```json
{
  "messages": [
    "Hello 👋",
    "How can I help you today?"
  ]
}
````
The widget dynamically renders the received messages in the chat UI.


## 🛠️ Local Development

```bash
git clone https://github.com/COMPLEOAGENCY/n8n-chat.git
````

## 📁 Recommended Folder Structure

├── dist/
│ ├── n8n-chat-widget.js
│ ├── n8n.css
│ ├── images/
│ └── audio/
├── n8n.html
└── index.html

## 📦 Dependencies

No external dependencies.  
The widget is built entirely with:

- ✅ **Vanilla JavaScript**
- 🎨 **CSS3**
- 🔧 **Native Web Components**

---

## 🧾 Roadmap (Coming Soon)

- 🔄 WebSocket support for real-time communication  
- 🌍 Multilingual / i18n support  
- 📎 File attachment (upload) support  
- 🧾 Download/export chat transcript

---

## 📘 License

**MIT** — Free to use and modify.  
Attribution is appreciated but not required.  
Made with ❤️ by **Compléo Agency**

---

## 🔗 Useful Links

- 🌐 [n8n.io](https://n8n.io)
- 💬 [Live Demo — ClubTravaux](https://clubtravaux.com)
- 📦 [jsDelivr CDN](https://cdn.jsdelivr.net/gh/COMPLEOAGENCY/n8n-chat@latest/)