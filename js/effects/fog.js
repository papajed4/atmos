// Fog effect – multi-layer drifting mist using canvas
export class FogEffect {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.layers = [];
        this.animationId = null;
        this.isRunning = false;
        this.opacity = 0.6;
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
        this.generateLayers();
        this.isRunning = true;
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            // Regenerate layers to fit new dimensions
            if (this.layers.length > 0) {
                this.generateLayers();
            }
        }
    }

    generateLayers() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        this.layers = [];

        // Background layer – large, slow, low opacity
        for (let i = 0; i < 4; i++) {
            this.layers.push({
                x: Math.random() * w * 1.5 - w * 0.25,
                y: Math.random() * h * 1.2 - h * 0.1,
                width: Math.random() * w * 0.8 + w * 0.4,
                height: Math.random() * h * 0.6 + h * 0.2,
                speedX: (Math.random() - 0.5) * 0.15,
                speedY: (Math.random() - 0.5) * 0.05,
                opacity: Math.random() * 0.12 + 0.06,
                layer: 'background'
            });
        }

        // Midground layer – medium size, medium speed
        for (let i = 0; i < 6; i++) {
            this.layers.push({
                x: Math.random() * w * 1.5 - w * 0.25,
                y: Math.random() * h * 1.2 - h * 0.1,
                width: Math.random() * w * 0.5 + w * 0.3,
                height: Math.random() * h * 0.4 + h * 0.15,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.08,
                opacity: Math.random() * 0.15 + 0.08,
                layer: 'midground'
            });
        }

        // Foreground layer – smaller, faster, higher opacity
        for (let i = 0; i < 8; i++) {
            this.layers.push({
                x: Math.random() * w * 1.5 - w * 0.25,
                y: Math.random() * h * 1.2 - h * 0.1,
                width: Math.random() * w * 0.3 + w * 0.15,
                height: Math.random() * h * 0.3 + h * 0.1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.12,
                opacity: Math.random() * 0.12 + 0.06,
                layer: 'foreground'
            });
        }
    }

    drawFogLayer(ctx, layer) {
        const { x, y, width, height, opacity } = layer;

        // Create a soft radial gradient for the fog
        const grad = ctx.createRadialGradient(
            x + width * 0.5, y + height * 0.5, 0,
            x + width * 0.5, y + height * 0.5, Math.max(width, height) * 0.6
        );
        grad.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        grad.addColorStop(0.4, `rgba(255, 255, 255, ${opacity * 0.7})`);
        grad.addColorStop(0.7, `rgba(255, 255, 255, ${opacity * 0.3})`);
        grad.addColorStop(1, `rgba(255, 255, 255, 0)`);

        ctx.beginPath();
        // Draw an ellipse for soft edges
        ctx.ellipse(x + width * 0.5, y + height * 0.5, width * 0.5, height * 0.5, 0, 0, Math.PI * 2);
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

        // Draw each fog layer
        for (let layer of this.layers) {
            // Move layer
            layer.x += layer.speedX;
            layer.y += layer.speedY;

            // Wrap around smoothly
            if (layer.x > w + layer.width) {
                layer.x = -layer.width;
                layer.y = Math.random() * h * 1.2 - h * 0.1;
            } else if (layer.x < -layer.width) {
                layer.x = w + layer.width;
                layer.y = Math.random() * h * 1.2 - h * 0.1;
            }

            if (layer.y > h + layer.height) {
                layer.y = -layer.height;
                layer.x = Math.random() * w * 1.5 - w * 0.25;
            } else if (layer.y < -layer.height) {
                layer.y = h + layer.height;
                layer.x = Math.random() * w * 1.5 - w * 0.25;
            }

            this.drawFogLayer(ctx, layer);
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
let fogInstance = null;

export function startFog() {
    if (!fogInstance) {
        fogInstance = new FogEffect();
        fogInstance.init();
    } else {
        fogInstance.setVisible(true);
    }
}

export function stopFog() {
    if (fogInstance) {
        fogInstance.setVisible(false);
    }
}