window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
  if ((event.origin !== "http://localhost:8001") && (event.origin !== "http://localhost:8002")) {
    return;
  }    
  
  if (event.origin === "http://localhost:8001") {
    document.body.style.backgroundColor = "green";
  }
    
  if (event.origin === "http://localhost:8002") {
    document.body.style.backgroundColor = "red";
  }
}
