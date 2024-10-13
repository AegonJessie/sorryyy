// JavaScript code for heart particles (existing code)
const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function Heart(x, y) {
  this.x = x || Math.random() * canvas.width;
  this.y = y || canvas.height + Math.random() * 100;
  this.size = Math.random() * 20 + 10;
  this.speedY = Math.random() * 1 + 0.5;
  this.alpha = Math.random() * 0.5 + 0.5;
  this.angle = Math.random() * 360;
}

Heart.prototype.draw = function () {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.angle);
  ctx.scale(this.size / 20, this.size / 20);

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(0, -3, -5, -3, -5, 0);
  ctx.bezierCurveTo(-5, 3, 0, 5, 0, 7);
  ctx.bezierCurveTo(0, 5, 5, 3, 5, 0);
  ctx.bezierCurveTo(5, -3, 0, -3, 0, 0);
  ctx.closePath();

  ctx.fillStyle = `rgba(255, 51, 102, ${this.alpha})`;
  ctx.fill();
  ctx.restore();
};

Heart.prototype.update = function () {
  this.y -= this.speedY;
  if (this.y < -10) {
    this.y = canvas.height + Math.random() * 100;
    this.x = Math.random() * canvas.width;
  }
};

let heartsArray = [];
for (let i = 0; i < 100; i++) {
  heartsArray.push(new Heart());
}

// Butterflies array
let butterflies = [];

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  heartsArray.forEach((heart) => {
    heart.update();
    heart.draw();
  });

  // Update butterflies
  butterflies.forEach((butterfly, index) => {
    const alive = butterfly.update();
    if (!alive) {
      butterflies.splice(index, 1);
    }
  });

  requestAnimationFrame(animate);
}

animate();

// Butterfly class definition
class Butterfly {
  constructor(x, y) {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    // Initial position
    this.x = x;
    this.y = y;

    // Movement speed
    this.vx = (Math.random() - 0.5) * 2; // Slight horizontal spread
    this.vy = -(2 + Math.random() * 1); // Move upwards

    // Scale for size variation
    this.scale = 1 + Math.random() * 0.5; // Random scale between 0.5 and 1.0

    // Create the butterfly element
    this.element = this.createButterflyElement();

    // Add the butterfly to the document
    document.body.appendChild(this.element);

    // Bind the resize event to update window dimensions
    window.addEventListener("resize", () => {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    });
  }

  createButterflyElement() {
    // Create butterfly container
    const container = document.createElement("div");
    container.className = "butterfly_container";
    container.style.transform = `translate(${this.x}px, ${this.y}px) scale(${this.scale})`;

    // Create div element
    const divElem = document.createElement("div");

    // Create figure element
    const figure = document.createElement("figure");
    figure.className = "butterfly";

    // Create left wing
    const leftWing = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    leftWing.classList.add("wing", "left");
    leftWing.setAttribute("viewBox", "0 0 119.744 148.477");
    const leftUse = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "use"
    );
    leftUse.setAttribute("href", "#shape-moth");
    leftWing.appendChild(leftUse);

    // Create right wing
    const rightWing = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    rightWing.classList.add("wing", "right");
    rightWing.setAttribute("viewBox", "0 0 119.744 148.477");
    const rightUse = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "use"
    );
    rightUse.setAttribute("href", "#shape-moth");
    rightWing.appendChild(rightUse);

    // Append wings to figure
    figure.appendChild(leftWing);
    figure.appendChild(rightWing);

    // Append figure to div
    divElem.appendChild(figure);

    // Append div to container
    container.appendChild(divElem);

    return container;
  }

  update() {
    // Update position
    this.x += this.vx;
    this.y += this.vy;

    // Remove butterfly if it goes off-screen
    if (
      this.x + 100 * this.scale < -500 ||
      this.y + 100 * this.scale < -500
    ) {
      this.remove();
      return false;
    }

    // Update element position
    this.element.style.transform = `translate(${this.x}px, ${this.y}px) scale(${this.scale})`;

    return true;
  }

  remove() {
    this.element.remove();
  }
}

// Function to trigger butterflies when the button is pressed
function triggerBurst() {
  // Get button position
  const button = document.querySelector("button");
  const rect = button.getBoundingClientRect();

  // Calculate center of the button
  const centerX = rect.left - 100 + rect.width / 2;
  const centerY = rect.top - 600 + rect.height / 2;

  // Create multiple butterflies at the button's position
  butterflies.push(new Butterfly(centerX, centerY));

  // Optional: Play background music upon interaction
  const music = document.getElementById("background-music");
  if (music.paused) {
    music.play();
  }
}