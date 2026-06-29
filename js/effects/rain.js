// Rain particle system using canvas
export class RainEffect {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.drops = [];
        this.animationId = null;
        this.isRunning = false;
        this.opacity = 0.7;
    }

    // Initialize canvas overlay
    init() {
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

        this.resize();
        this.generateDrops();
        this.isRunning = true;
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            // Regenerate drops on resize to match new dimensions
            if (this.drops.length > 0) {
                this.generateDrops();
            }
        }
    }

    generateDrops() {
        const count = Math.min(300, Math.floor(window.innerWidth * 0.4));
        this.drops = [];
        for (let i = 0; i < count; i++) {
            this.drops.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height - this.canvas.height,
                length: Math.random() * 15 + 5,
                speed: Math.random() * 15 + 10,
                opacity: Math.random() * 0.4 + 0.3,
                // Slight horizontal drift (wind)
                wind: (Math.random() - 0.5) * 0.8
            });
        }
    }

    animate() {
        if (!this.isRunning) return;
        this.animationId = requestAnimationFrame(() => this.animate());

        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Clear with slight trail (transparent) for motion blur effect
        ctx.clearRect(0, 0, w, h);

        // Draw each rain drop as a line
        for (let d of this.drops) {
            d.y += d.speed;
            d.x += d.wind;

            // Wrap around
            if (d.y > h + 20) {
                d.y = -20;
                d.x = Math.random() * w;
                // Reset wind slightly for variety
                d.wind = (Math.random() - 0.5) * 0.8;
            }
            if (d.x < -20) d.x = w + 20;
            if (d.x > w + 20) d.x = -20;

            // Draw the drop as a line
            const endX = d.x + d.wind * d.length * 0.3;
            const endY = d.y - d.length;
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = `rgba(255, 255, 255, ${d.opacity * this.opacity})`;
            ctx.lineWidth = Math.random() * 1.2 + 0.5;
            ctx.stroke();
        }
    }

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
            if (this.ctx) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        }
    }

    destroy() {
        this.setVisible(false);
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        this.canvas = null;
        this.ctx = null;
    }
}

// Singleton
let rainInstance = null;

export function startRain() {
    if (!rainInstance) {
        rainInstance = new RainEffect();
        rainInstance.init();
    } else {
        rainInstance.setVisible(true);
    }
}

export function stopRain() {
    if (rainInstance) {
        rainInstance.setVisible(false);
    }
}