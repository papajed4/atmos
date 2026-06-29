// Cloud system – soft, drifting cloud layers using canvas
export class CloudEffect {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.clouds = [];
        this.animationId = null;
        this.isRunning = false;
        this.opacity = 0.8;
    }

    init() {
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.style.position = 'fixed';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100vw';
            this.canvas.style.height = '100vh';
            this.canvas.style.pointerEvents = 'none';
            this.canvas.style.zIndex = '2';
            document.body.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
        }

        this.resize();
        this.generateClouds();
        this.isRunning = true;
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            // Regenerate clouds to fit new width
            if (this.clouds.length > 0) {
                this.generateClouds();
            }
        }
    }

    generateClouds() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const count = Math.floor(w / 200) + 6; // ~10-15 clouds

        this.clouds = [];

        // Background layer – smaller, slower, lower opacity
        for (let i = 0; i < count * 0.7; i++) {
            this.clouds.push({
                x: Math.random() * w * 1.5 - w * 0.25,
                y: Math.random() * h * 0.7 + h * 0.05,
                width: Math.random() * 250 + 150,
                height: Math.random() * 60 + 30,
                speed: Math.random() * 0.15 + 0.05,
                opacity: Math.random() * 0.15 + 0.08,
                layer: 'background'
            });
        }

        // Midground layer – medium size, medium speed
        for (let i = 0; i < count * 0.5; i++) {
            this.clouds.push({
                x: Math.random() * w * 1.5 - w * 0.25,
                y: Math.random() * h * 0.8 + h * 0.05,
                width: Math.random() * 320 + 200,
                height: Math.random() * 80 + 40,
                speed: Math.random() * 0.3 + 0.15,
                opacity: Math.random() * 0.15 + 0.12,
                layer: 'midground'
            });
        }

        // Foreground layer – large, fast, higher opacity
        for (let i = 0; i < count * 0.3; i++) {
            this.clouds.push({
                x: Math.random() * w * 1.5 - w * 0.25,
                y: Math.random() * h * 0.6 + h * 0.1,
                width: Math.random() * 400 + 250,
                height: Math.random() * 100 + 50,
                speed: Math.random() * 0.5 + 0.3,
                opacity: Math.random() * 0.12 + 0.08,
                layer: 'foreground'
            });
        }
    }

    // Draw a single cloud using overlapping circles (soft, puffy look)
    drawCloud(ctx, cloud) {
        const { x, y, width, height, opacity } = cloud;
        const w = width;
        const h = height;

        // Create a radial gradient for the cloud
        const grad = ctx.createRadialGradient(
            x + w * 0.3, y + h * 0.3, 0,
            x + w * 0.5, y + h * 0.5, w * 0.7
        );
        grad.addColorStop(0, `rgba(255, 255, 255, ${opacity * 1.2})`);
        grad.addColorStop(0.5, `rgba(255, 255, 255, ${opacity * 0.8})`);
        grad.addColorStop(1, `rgba(255, 255, 255, 0)`);

        // Main body – large rounded rect or multiple circles
        // We'll use a combination of circles for a fluffy look
        const circles = [
            { dx: 0, dy: 0, r: h * 0.6 },
            { dx: -w * 0.3, dy: h * 0.1, r: h * 0.5 },
            { dx: w * 0.3, dy: h * 0.05, r: h * 0.55 },
            { dx: -w * 0.15, dy: -h * 0.2, r: h * 0.5 },
            { dx: w * 0.15, dy: -h * 0.15, r: h * 0.5 },
            { dx: w * 0.55, dy: h * 0.2, r: h * 0.4 },
            { dx: -w * 0.55, dy: h * 0.2, r: h * 0.4 },
        ];

        ctx.beginPath();
        for (let c of circles) {
            ctx.moveTo(x + c.dx + c.r, y + c.dy);
            ctx.arc(x + c.dx, y + c.dy, c.r, 0, Math.PI * 2);
        }
        ctx.closePath();

        ctx.fillStyle = grad;
        ctx.fill();
    }

    animate() {
        if (!this.isRunning) return;
        this.animationId = requestAnimationFrame(() => this.animate());

        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Clear with transparency
        ctx.clearRect(0, 0, w, h);

        // Draw each cloud
        for (let cloud of this.clouds) {
            // Move cloud
            cloud.x += cloud.speed;

            // Wrap around seamlessly
            if (cloud.x > w + cloud.width * 0.5) {
                cloud.x = -cloud.width * 0.5;
                cloud.y = Math.random() * h * 0.7 + h * 0.05;
            }

            this.drawCloud(ctx, cloud);
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
let cloudInstance = null;

export function startClouds() {
    if (!cloudInstance) {
        cloudInstance = new CloudEffect();
        cloudInstance.init();
    } else {
        cloudInstance.setVisible(true);
    }
}

export function stopClouds() {
    if (cloudInstance) {
        cloudInstance.setVisible(false);
    }
}