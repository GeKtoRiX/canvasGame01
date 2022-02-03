import { style } from "./main.css";
import { gsap } from "gsap";

const htmlCanvas = document.getElementById("canvas");
const canvas = htmlCanvas.getContext("2d");

const scoreEl = document.getElementById("scoreEl");
const finalScore = document.querySelector(".finalScore");
const menu = document.querySelector(".menu");
const gameOn = document.querySelector(".gameOn");

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
gameOn.addEventListener("click", () => {
  reset();
  animate();
  spawnEnemies();
  menu.style.display = "none";
});
// TimeOut first shoot before the round.
setTimeout(() => {
  window.addEventListener("click", (event) => {
    const angle = Math.atan2(
      event.clientY - center.y,
      event.clientX - center.x
    );
    projectiles.push(
      new Projectile(
        center.x,
        center.y,
        8,
        {
          x: Math.cos(angle) * 10,
          y: Math.sin(angle) * 10,
        },
        "white"
      )
    );
  });
}, 2000);

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
    canvas.strokeStyle = "white";
    canvas.lineWidth = 3;
    canvas.fillStyle = this.color;
    canvas.arc(this.x, this.y, this.radius, 0, Math.PI * 180, false);
    canvas.fill();
    canvas.stroke();
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
const friction = 0.98;
class Particle {
  constructor(x, y, radius, velocity, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocity = velocity;
    this.color = color;
    this.alpha = 1;
  }
  draw() {
    canvas.save();
    canvas.globalAlpha = this.alpha;
    canvas.beginPath();
    canvas.fillStyle = this.color;
    canvas.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    canvas.fill();
    canvas.restore();
    canvas.closePath();
  }
  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01;
  }
}
let projectiles = [];
let particles = [];
let enemies = [];
let player = new Player(
  center.x,
  center.y,
  64,
  `hsl(${Math.random() * 360},50%,50%)`
);

let score = 0;
let spawnSpeed;
let enemySpeed;

function reset() {
  projectiles = [];
  particles = [];
  enemies = [];
  player = new Player(
    center.x,
    center.y,
    64,
    `hsl(${Math.random() * 360}, 50%, 50%)`
  );
  spawnSpeed = 2000;
  enemySpeed = 1;
  score = 0;
  scoreEl.innerHTML = score;
}
function spawnEnemies() {
  spawnSpeed = 2000;
  enemySpeed = 1;
  setInterval(() => {
    const radius = Math.random() * (64 - 8) + 8;
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
    const velocity = {
      x: Math.cos(angle) * enemySpeed,
      y: Math.sin(angle) * enemySpeed,
    };
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
  particles.forEach((particle, partIndex) => {
    if (particle.alpha <= 0) {
      particles.splice(partIndex, 1);
    } else {
      particle.update();
    }
  });
  // Kill arcs while collapsing enemy and projectile.
  enemies.forEach((enemy, enemyIndex) => {
    enemy.update();
    // End the game.
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (dist - enemy.radius - player.radius < 1) {
      if (player.radius > 16) {
        gsap.to(player, {
          radius: player.radius - 16,
        });
      } else {
        finalScore.innerHTML = scoreEl.innerText;
        menu.style.display = "inline-block";
        cancelAnimationFrame(animationId);
      }
      enemies.splice(enemyIndex, 1);
      for (let i = 0; i < enemy.radius * 2; i++) {
        particles.push(
          new Particle(
            enemy.x,
            enemy.y,
            Math.random() * 3,
            {
              x: (Math.random() - 0.5) * Math.random() * 3,
              y: (Math.random() - 0.5) * Math.random() * 3,
            },
            enemy.color
          )
        );
      }
    }
    projectiles.forEach((projectile, projectileIndex) => {
      // Distance between arcs.
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
      // Kill arcs.
      if (dist - enemy.radius - projectile.radius < 1) {
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 3,
              {
                x: (Math.random() - 0.5) * Math.random() * 3,
                y: (Math.random() - 0.5) * Math.random() * 3,
              },
              enemy.color
            )
          );
        }
        setTimeout(() => {
          if (enemy.radius > 30) {
            // smooth shrink animation of arcs.
            gsap.to(enemy, {
              radius: enemy.radius - 10,
            });
          } else {
            enemies.splice(enemyIndex, 1);
            // Increase SpawnSpeed.
            if (spawnSpeed > 0) {
              spawnSpeed -= 100;
            }
            // Set min default spawnSpeed and increase enemySpeed.
            else {
              spawnSpeed = 2000;
              enemySpeed += 0.3;
            }
            score += 1;
            scoreEl.innerHTML = score;
          }
          projectiles.splice(projectileIndex, 1);
        }, 0);
      }
    });
  });
}
