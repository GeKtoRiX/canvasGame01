import style from "./main.css";

const htmlCanvas = document.getElementById("canvas");
const canvas = htmlCanvas.getContext("2d");

htmlCanvas.width = window.innerWidth - 4;
htmlCanvas.height = window.innerHeight - 4;

window.addEventListener("resize", () => {
  htmlCanvas.width = window.innerWidth - 4;
  htmlCanvas.height = window.innerHeight - 4;
  // init();
});
window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});
window.addEventListener("click", (event) => {
  const angle = Math.atan2(event.clientY - center.y, event.clientX - center.x);
  projectiles.push(
    new Projectile(
      center.x,
      center.y,
      8,
      {
        x: Math.cos(angle) * 10,
        y: Math.sin(angle) * 10,
      },
      "red"
    )
  );
});
const center = {
  x: htmlCanvas.width / 2,
  y: htmlCanvas.height / 2,
};
var mouse = {
  x: htmlCanvas.width / 2,
  y: htmlCanvas.height / 2,
};
class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  draw() {
    canvas.beginPath();
    canvas.fillStyle = this.color;
    canvas.arc(this.x, this.y, this.radius, 0, Math.PI * 180, false);
    canvas.fill();
    canvas.closePath();
  }
  update() {
    this.draw();
  }
}
class Projectile {
  constructor(x, y, radius, velocity, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocity = velocity;
    this.color = color;
  }
  draw() {
    canvas.beginPath();
    canvas.fillStyle = this.color;
    canvas.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    canvas.fill();
    canvas.closePath();
  }
  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.draw();
  }
}
class Enemy {
  constructor(x, y, radius, velocity, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocity = velocity;
    this.color = color;
  }
  draw() {
    canvas.beginPath();
    canvas.fillStyle = this.color;
    canvas.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    canvas.fill();
    canvas.closePath();
  }
  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}
const projectiles = [];
const enemies = [];
const player = new Player(center.x, center.y, 60, "blue");

let score = 0;
let spawnSpeed;
let enemySpeed;
function spawnEnemies() {
  spawnSpeed = 2000;
  enemySpeed = 1;
  setInterval(() => {
    const radius = Math.random() * (80 - 20) + 20;
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : htmlCanvas.width + radius;
      y = Math.random() * htmlCanvas.height;
    } else {
      x = Math.random() * htmlCanvas.width;
      y = Math.random() < 0.5 ? 0 - radius : htmlCanvas.height + radius;
    }
    const angle = Math.atan2(center.y - y, center.x - x);
    const velocity = { x: Math.cos(angle) * enemySpeed, y: Math.sin(angle) * enemySpeed };
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    enemies.push(new Enemy(x, y, radius, velocity, color));
  }, spawnSpeed);
}
let animationId;
function animate() {
  animationId = requestAnimationFrame(animate);
  canvas.fillStyle = "rgba(0, 0, 0, 0.3)";
  canvas.fillRect(0, 0, htmlCanvas.width, htmlCanvas.height);
  player.update();
  projectiles.forEach((projectile, indexOutOfBounds) => {
    projectile.update();
    // Projectile out of bounds.
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > htmlCanvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > htmlCanvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(indexOutOfBounds, 1);
      }, 0);
    }
  });
  // Kill arcs while collapsing enemy and projectile.
  enemies.forEach((enemy, enemyIndex) => {
    enemy.update();
    // End the game.
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (dist - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationId);
    }
    projectiles.forEach((projectile, projectileIndex) => {
      // Distance between arcs.
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
      // Kill arcs.
      if (dist - enemy.radius - projectile.radius < 1) {
        setTimeout(() => {
          if(enemy.radius > 30){
            enemy.radius -= 10;
          }
          else{
              enemies.splice(enemyIndex,1);
              // Increase SpawnSpeed.
              if(spawnSpeed > 0){
                spawnSpeed -= 100;
              }
              // Set min default spawnSpeed and increase enemySpeed.
              else{
                spawnSpeed = 1000;
                enemySpeed += 0.5;
              }
              score += 10;
          }
          projectiles.splice(projectileIndex, 1);
        }, 0);
      }
    });
  });
  console.log('Score: ' + score);
}
animate();
spawnEnemies();
