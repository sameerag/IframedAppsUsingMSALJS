// post a message to the parent
window.parent.postMessage("testHashFromClient2", "http://localhost:8000");

window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
  if (event.origin !== "http://localhost:8002/auth.html")
	return;

  console.log(message);

  document.body.style.backgroundColor = "teal";
}


