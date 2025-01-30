console.log("Hello World");

// Initialize the canvas
const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");
canvas.style.display = "none";
// Initialize the pseudo
let pseudo;
let positions = {};

// Mouse move handler
const mouseMoveHandler = (event) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;

  fetch("http://localhost:3000/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pseudo, x, y }),
  });
};

function joinTracker() {
  pseudo = document.getElementById("pseudo").value;
  document.getElementById("user-input").style.display = "none";
  canvas.style.display = "block";
  canvas.addEventListener("mousemove", mouseMoveHandler);

  const ws = new WebSocket("ws://localhost:3000");

  ws.onmessage = (event) => {
    const { pseudo, positions } = JSON.parse(event.data);
    displayPosition(pseudo, positions);
  };
}

function displayPosition(pseudo, { x, y }) {
  // Store the positions
  positions[pseudo] = { x, y };

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set font and color for the text
  ctx.font = "8px Arial";
  ctx.fillStyle = "black";

  console.log(pseudo, x, y);

  // Ensure the coordinates are within the canvas boundaries
  if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
    console.error(`Coordinates (${x}, ${y}) are out of canvas bounds`);
    return;
  }

  // Display the pseudo and positions
  Object.entries(positions).forEach(([pseudo, { x, y }]) => {
    ctx.fillText(`${pseudo}`, x, y);
  });
}

window.joinTracker = joinTracker;
window.leaveTracker = leaveTracker;
