document.getElementById("chatInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // Évite le saut de ligne
    sendMessage();
  }
});
