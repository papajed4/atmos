// Lightning effect – random bright flashes with optional rumble
export class LightningEffect {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.isRunning = false;
        this.flashAlpha = 0;
        this.nextFlashTime = 0;
        this.flashDuration = 0;
        this.flashIntensity = 0;
        this.thunderTimeout = null;
        this.audioContext = null;
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
            this.canvas.style.zIndex = '4';
            document.body.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
        }

        this.resize();
        this.isRunning = true;
        this.nextFlashTime = this.getRandomInterval();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }

    // Random time until next flash (2-15 seconds)
    getRandomInterval() {
        return Math.random() * 13000 + 2000; // 2-15 seconds
    }

    // Random flash duration (100-400ms)
    getRandomDuration() {
        return Math.random() * 300 + 100;
    }

    // Random intensity (0.3-1.0)
    getRandomIntensity() {
        return Math.random() * 0.7 + 0.3;
    }

    // Generate a random lightning bolt shape (for optional visual)
    drawBolt(ctx, x, y, intensity) {
        // Simple jagged bolt from top to bottom
        const segments = 8 + Math.floor(Math.random() * 6);
        let startX = x + (Math.random() - 0.5) * 200;
        let startY = 0;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        let currentX = startX;
        let currentY = startY;
        for (let i = 0; i < segments; i++) {
            const nextY = currentY + (canvas.height / segments) * (0.6 + Math.random() * 0.8);
            const nextX = currentX + (Math.random() - 0.5) * 120;
            ctx.lineTo(nextX, nextY);
            currentX = nextX;
            currentY = nextY;
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${intensity * 0.8})`;
        ctx.lineWidth = 2 + intensity * 4;
        ctx.shadowColor = `rgba(255, 255, 255, ${intensity * 0.5})`;
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    // Play thunder sound using Web Audio (synthesized)
    playThunder(intensity) {
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            // Create a low-frequency rumble
            const duration = 1 + intensity * 2; // 1-3 seconds
            const bufferSize = this.audioContext.sampleRate * duration;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                // Low-frequency noise with decay
                const t = i / bufferSize;
                const envelope = Math.exp(-t * 4); // rapid decay
                const noise = (Math.random() * 2 - 1) * envelope * 0.3;
                // Add some rumble
                const rumble = Math.sin(i * 0.02) * envelope * 0.2;
                data[i] = (noise + rumble) * intensity * 0.5;
            }
            const source = this.audioContext.createBufferSource();
            source.buffer = buffer;
            const gain = this.audioContext.createGain();
            gain.gain.value = 0.3 * intensity;
            source.connect(gain);
            gain.connect(this.audioContext.destination);
            source.start();
            source.stop(this.audioContext.currentTime + duration);
        } catch (e) {
            // Silently fail if audio not supported
        }
    }

    animate() {
        if (!this.isRunning) return;
        this.animationId = requestAnimationFrame(() => this.animate());

        const now = performance.now();

        // Check if it's time to flash
        if (now >= this.nextFlashTime) {
            // Flash
            this.flashIntensity = this.getRandomIntensity();
            this.flashDuration = this.getRandomDuration();
            this.flashAlpha = this.flashIntensity;

            // Reset timer
            this.nextFlashTime = now + this.getRandomInterval();

            // Optional: draw a lightning bolt
            if (this.flashIntensity > 0.5 && this.canvas) {
                const ctx = this.ctx;
                const w = this.canvas.width;
                const h = this.canvas.height;
                // Choose random x position
                const x = Math.random() * w;
                this.drawBolt(ctx, x, 0, this.flashIntensity);
            }

            // Play thunder with slight delay (sound travels slower)
            if (this.flashIntensity > 0.4) {
                const delay = Math.random() * 800 + 200;
                this.thunderTimeout = setTimeout(() => {
                    this.playThunder(this.flashIntensity);
                }, delay);
            }
        }

        // Fade out flash
        if (this.flashAlpha > 0) {
            const fadeSpeed = 0.02; // fade out quickly
            this.flashAlpha = Math.max(0, this.flashAlpha - fadeSpeed);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // Draw a white overlay with current alpha
            this.ctx.fillStyle = `rgba(255, 255, 255, ${this.flashAlpha * 0.8})`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            // Ensure canvas is clear when no flash
            if (this.flashAlpha === 0 && this.ctx) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        }
    }

    setVisible(visible) {
        if (visible && !this.isRunning) {
            this.isRunning = true;
            this.nextFlashTime = performance.now() + this.getRandomInterval();
            this.animate();
        } else if (!visible && this.isRunning) {
            this.isRunning = false;
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
            if (this.thunderTimeout) {
                clearTimeout(this.thunderTimeout);
                this.thunderTimeout = null;
            }
            if (this.ctx) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            if (this.audioContext) {
                // Optionally close context to save resources, but not necessary
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
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }
}

// Singleton
let lightningInstance = null;

export function startLightning() {
    if (!lightningInstance) {
        lightningInstance = new LightningEffect();
        lightningInstance.init();
    } else {
        lightningInstance.setVisible(true);
    }
}

export function stopLightning() {
    if (lightningInstance) {
        lightningInstance.setVisible(false);
    }
}