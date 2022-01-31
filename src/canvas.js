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
                x: Math.cos(angle),
                y: Math.sin(angle),
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
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
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

function spawnEnemies() {
    setInterval(() => {
        const radius = (Math.random() * (30 - 10) + 10);
        let x;
        let y;
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : htmlCanvas.width + radius;
            y = Math.random() * htmlCanvas.height;
        }
        else {
            x = Math.random() * htmlCanvas.width;
            y = Math.random() < 0.5 ? 0 - radius : htmlCanvas.height + radius;
        }
        const angle = Math.atan2(center.y - y, center.x - x);
        const velocity = { x: Math.cos(angle), y: Math.sin(angle) };
        const color = "green";
        enemies.push(new Enemy(x, y, radius, velocity, color));
    }, 2000);
}
function animate() {
    canvas.clearRect(0, 0, htmlCanvas.width, htmlCanvas.height);
    player.update();
    projectiles.forEach((projectile) => {
        projectile.update();
    });
    enemies.forEach((enemy, enemyIndex) => {
        enemy.update();
        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if (dist - enemy.radius - projectile.radius < 1) {
                enemies.splice(enemyIndex, 1);
                projectiles.splice(projectileIndex, 1);
            }
        });
    });
    requestAnimationFrame(animate);
}
animate();
spawnEnemies();
