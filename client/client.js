window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
  if (event.origin !== "http://localhost:8001")
    return;

  document.body.style.backgroundColor = "blue";
}