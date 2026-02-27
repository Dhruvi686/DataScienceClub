const canvas = document.getElementById('bg-animation');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// Configuration
const CONFIG = {
    particleCount: 100,
    connectionDistance: 120,
    mouseDistance: 150,
    particleColor: 'rgba(249, 115, 22, 0.6)', // Primary orange
    lineColor: 'rgba(255, 255, 255, 0.15)',   // Subtle white
    particleSpeed: 0.5,
    particleSize: 2
};

// Resize handling
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

// Particle Class
class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * CONFIG.particleSpeed;
        this.vy = (Math.random() - 0.5) * CONFIG.particleSpeed;
        this.size = Math.random() * CONFIG.particleSize + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen edges for continuous flow
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = CONFIG.particleColor;
        ctx.fill();
    }
}

// Initialize particles
function init() {
    particles = [];
    resize();
    // Adjust particle count based on screen size
    const count = window.innerWidth < 768 ? 50 : CONFIG.particleCount;
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

// Mouse interaction
let mouse = { x: null, y: null };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, index) => {
        p.update();
        p.draw();

        // Connect to other particles
        for (let j = index + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < CONFIG.connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = CONFIG.lineColor;
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }

        // Connect to mouse
        if (mouse.x != null) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < CONFIG.mouseDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(249, 115, 22, ${1 - distance / CONFIG.mouseDistance})`; // Fade out orange line
                ctx.lineWidth = 1;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(animate);
}

// Event Listeners
window.addEventListener('resize', () => {
    resize();
    init();
});

// Start
init();
animate();
