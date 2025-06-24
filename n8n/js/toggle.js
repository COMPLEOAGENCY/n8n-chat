function toggleChat() {
  const chat = document.getElementById("chatWindow");
  const toggle = document.querySelector(".chat-toggle");
  chat.classList.add("show");
  toggle.style.display = "none"; // Cacher la bulle
}

function closeChat() {
  const chat = document.getElementById("chatWindow");
  const toggle = document.querySelector(".chat-toggle");
  chat.classList.remove("show");
  toggle.style.display = "block"; // Réafficher la bulle
}
