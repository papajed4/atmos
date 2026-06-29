// Snow particle system using canvas
export class SnowEffect {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.isRunning = false;
        this.opacity = 1;
    }

    // Initialize canvas overlay
    init() {
        // Create canvas if not exists
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.style.position = 'fixed';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100vw';
            this.canvas.style.height = '100vh';
            this.canvas.style.pointerEvents = 'none';
            this.canvas.style.zIndex = '3';
            document.body.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
        }

        // Set canvas size to match viewport
        this.resize();

        // Generate particles
        this.generateParticles();

        // Start animation
        this.isRunning = true;
        this.animate();

        // Resize on window change
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }

    generateParticles() {
        const count = Math.min(200, Math.floor(window.innerWidth / 4));
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height - this.canvas.height,
                radius: Math.random() * 3 + 1,
                speed: Math.random() * 1.5 + 0.5,
                wind: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.6 + 0.4
            });
        }
    }

    animate() {
        if (!this.isRunning) return;
        this.animationId = requestAnimationFrame(() => this.animate());

        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Clear canvas with transparency
        ctx.clearRect(0, 0, w, h);

        // Update and draw each particle
        for (let p of this.particles) {
            p.y += p.speed;
            p.x += p.wind + Math.sin(p.y * 0.01) * 0.2;

            // Wrap around
            if (p.y > h) {
                p.y = -10;
                p.x = Math.random() * w;
            }
            if (p.x < -10) p.x = w + 10;
            if (p.x > w + 10) p.x = -10;

            // Draw snowflake
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * this.opacity})`;
            ctx.fill();
        }
    }

    // Show/hide with fade
    setVisible(visible) {
        if (visible && !this.isRunning) {
            this.isRunning = true;
            this.animate();
        } else if (!visible && this.isRunning) {
            this.isRunning = false;
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
            // Fade out: we just clear the canvas
            if (this.ctx) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        }
    }

    // Clean up
    destroy() {
        this.setVisible(false);
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        this.canvas = null;
        this.ctx = null;
    }
}

// Singleton instance
let snowInstance = null;

export function startSnow() {
    if (!snowInstance) {
        snowInstance = new SnowEffect();
        snowInstance.init();
    } else {
        snowInstance.setVisible(true);
    }
}

export function stopSnow() {
    if (snowInstance) {
        snowInstance.setVisible(false);
    }
}