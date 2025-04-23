/**
 * Enhanced power-up effects for the AI Defender game
 * Makes power-ups more visually impressive and "pop" when collected
 */

/**
 * PowerUp class for the AI Defender game
 */
class PowerUp {
    /**
     * Create a new power-up
     * @param {number} x - Initial x position
     * @param {number} y - Initial y position
     * @param {string} type - Power-up type ('rapidFire', 'tripleShot', or 'shield')
     */
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.radius = 15;
        this.speed = 2;
        this.rotation = 0;
        this.rotationSpeed = 0.03;
        this.active = true;
        this.lifespan = 10000; // 10 seconds
        this.age = 0;
        
        // Animation properties
        this.pulsePhase = 0;
        this.pulseSpeed = 0.1;
        this.glowSize = 1.5;
        this.glowOpacity = 0.5;
        this.orbitParticles = [];
        this.generateOrbitParticles();
        
        // Set color based on type
        switch (type) {
            case 'rapidFire':
                this.color = '#ff9900'; // Orange
                this.symbol = '⚡'; // Lightning bolt
                this.glowColor = 'rgba(255, 153, 0, 0.5)';
                break;
            case 'tripleShot':
                this.color = '#9900ff'; // Purple
                this.symbol = '✱'; // Triple shot
                this.glowColor = 'rgba(153, 0, 255, 0.5)';
                break;
            case 'shield':
                this.color = '#00ff99'; // Green
                this.symbol = '⚕'; // Shield
                this.glowColor = 'rgba(0, 255, 153, 0.5)';
                break;
            default:
                this.color = '#ffffff'; // White
                this.symbol = '?';
                this.glowColor = 'rgba(255, 255, 255, 0.5)';
        }
    }

    /**
     * Generate particles that orbit around the power-up
     */
    generateOrbitParticles() {
        const particleCount = 5;
        for (let i = 0; i < particleCount; i++) {
            this.orbitParticles.push({
                angle: (i / particleCount) * Math.PI * 2,
                distance: this.radius * 1.8,
                speed: 0.02 + Math.random() * 0.02,
                size: 2 + Math.random() * 2,
                opacity: 0.6 + Math.random() * 0.4
            });
        }
    }

    /**
     * Update power-up state
     * @param {number} deltaTime - Time since last update in milliseconds
     * @param {number} canvasHeight - Canvas height
     * @returns {boolean} True if power-up is still active
     */
    update(deltaTime, canvasHeight) {
        // Move downward
        this.y += this.speed;
        
        // Rotate
        this.rotation += this.rotationSpeed;
        
        // Update age
        this.age += deltaTime;
        
        // Update pulse effect
        this.pulsePhase += this.pulseSpeed;
        if (this.pulsePhase > Math.PI * 2) {
            this.pulsePhase -= Math.PI * 2;
        }
        
        // Update orbit particles
        this.orbitParticles.forEach(particle => {
            particle.angle += particle.speed;
            if (particle.angle > Math.PI * 2) {
                particle.angle -= Math.PI * 2;
            }
        });
        
        // Deactivate if off screen or too old
        if (this.y > canvasHeight + this.radius || this.age > this.lifespan) {
            this.active = false;
        }
        
        return this.active;
    }

    /**
     * Draw power-up on canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        ctx.save();
        
        // Move to power-up position and apply rotation
        ctx.translate(this.x, this.y);
        
        // Draw outer glow
        const pulseScale = 1 + 0.2 * Math.sin(this.pulsePhase);
        const glowRadius = this.radius * this.glowSize * pulseScale;
        const gradient = ctx.createRadialGradient(0, 0, this.radius, 0, 0, glowRadius);
        gradient.addColorStop(0, this.glowColor);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw orbit particles
        this.orbitParticles.forEach(particle => {
            const x = Math.cos(particle.angle) * particle.distance;
            const y = Math.sin(particle.angle) * particle.distance;
            
            ctx.beginPath();
            ctx.arc(x, y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = particle.opacity;
            ctx.fill();
        });
        
        ctx.globalAlpha = 1;
        ctx.rotate(this.rotation);
        
        // Draw hexagon background
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * this.radius;
            const y = Math.sin(angle) * this.radius;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        
        // Fill with color
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Add stroke
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw symbol
        ctx.fillStyle = '#ffffff';
        ctx.font = `${this.radius}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.symbol, 0, 0);
        
        // Make power-up pulse/glow if near end of lifespan
        if (this.age > this.lifespan * 0.7) {
            const pulseRate = 200; // ms
            const alpha = 0.3 + 0.7 * Math.abs(Math.sin(this.age / pulseRate));
            
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        
        ctx.restore();
    }

    /**
     * Check if power-up collides with player
     * @param {Player} player - Player object
     * @returns {boolean} True if collision occurred
     */
    checkCollision(player) {
        return Utils.circleCollision(
            {x: this.x, y: this.y, radius: this.radius},
            {x: player.x, y: player.y, radius: player.radius}
        );
    }
}

/**
 * PowerUpManager class for handling multiple power-ups
 */
class PowerUpManager {
    /**
     * Create a new power-up manager
     * @param {number} canvasWidth - Canvas width
     * @param {number} canvasHeight - Canvas height
     */
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.powerUps = [];
        this.spawnRate = 15000; // Time between power-up spawns in milliseconds
        this.spawnTimer = 5000; // Start with a shorter initial timer
        this.types = ['rapidFire', 'tripleShot', 'shield'];
        
        // Collection effect properties
        this.collectionEffects = [];
    }

    /**
     * Update all power-ups
     * @param {number} deltaTime - Time since last update in milliseconds
     */
    update(deltaTime) {
        // Update spawn timer
        this.spawnTimer += deltaTime;
        
        // Spawn new power-up if timer exceeds spawn rate
        if (this.spawnTimer >= this.spawnRate) {
            this.spawnPowerUp();
            this.spawnTimer = 0;
        }
        
        // Update all power-ups and remove inactive ones
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            if (!powerUp.update(deltaTime, this.canvasHeight)) {
                this.powerUps.splice(i, 1);
            }
        }
        
        // Update collection effects
        for (let i = this.collectionEffects.length - 1; i >= 0; i--) {
            const effect = this.collectionEffects[i];
            effect.age += deltaTime;
            
            if (effect.age >= effect.duration) {
                this.collectionEffects.splice(i, 1);
            }
        }
    }

    /**
     * Draw all power-ups
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        // Draw power-ups
        for (const powerUp of this.powerUps) {
            powerUp.draw(ctx);
        }
        
        // Draw collection effects
        for (const effect of this.collectionEffects) {
            this.drawCollectionEffect(ctx, effect);
        }
    }

    /**
     * Draw collection effect
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} effect - Collection effect object
     */
    drawCollectionEffect(ctx, effect) {
        const progress = effect.age / effect.duration;
        const size = effect.baseSize * (1 + progress * 2);
        const opacity = 1 - progress;
        
        ctx.save();
        ctx.translate(effect.x, effect.y);
        
        // Draw expanding ring
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.strokeStyle = effect.color;
        ctx.lineWidth = 3 * (1 - progress);
        ctx.globalAlpha = opacity;
        ctx.stroke();
        
        // Draw particles
        effect.particles.forEach(particle => {
            const particleProgress = Math.min(1, effect.age / (effect.duration * 0.7));
            const x = particle.x * particleProgress * effect.baseSize * 3;
            const y = particle.y * particleProgress * effect.baseSize * 3;
            const particleSize = particle.size * (1 - particleProgress);
            
            ctx.beginPath();
            ctx.arc(x, y, particleSize, 0, Math.PI * 2);
            ctx.fillStyle = effect.color;
            ctx.globalAlpha = opacity * (1 - particleProgress);
            ctx.fill();
        });
        
        // Draw text
        if (progress < 0.5) {
            const textOpacity = 1 - (progress * 2);
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = effect.color;
            ctx.globalAlpha = textOpacity;
            
            // Make text float upward
            const textY = -20 * progress;
            ctx.fillText(effect.text, 0, textY);
        }
        
        ctx.restore();
    }

    /**
     * Spawn a new power-up
     * @param {string} forcedType - Optional type to force (for testing)
     */
    spawnPowerUp(forcedType = null) {
        // Determine spawn position
        const x = Utils.randomRange(50, this.canvasWidth - 50);
        const y = -30; // Start above the canvas
        
        // Determine power-up type
        const type = forcedType || this.types[Utils.randomRange(0, this.types.length - 1)];
        
        // Create and add power-up
        this.powerUps.push(new PowerUp(x, y, type));
    }

    /**
     * Check for collisions with player
     * @param {Player} player - Player object
     * @returns {string|null} Type of collected power-up or null if none
     */
    checkCollisions(player) {
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            
            if (powerUp.checkCollision(player)) {
                // Remove power-up
                const type = powerUp.type;
                this.powerUps.splice(i, 1);
                
                // Create collection effect
                this.createCollectionEffect(player.x, player.y, powerUp.color, type);
                
                // Create particle effect
                Utils.createParticles(
                    document.getElementById('game-canvas').getContext('2d'),
                    player.x,
                    player.y,
                    25, // increased particle count
                    powerUp.color, // color
                    3, // increased speed
                    4, // increased size
                    1200 // increased duration
                );
                
                return type;
            }
        }
        
        return null;
    }

    /**
     * Create collection effect
     * @param {number} x - Effect x position
     * @param {number} y - Effect y position
     * @param {string} color - Effect color
     * @param {string} type - Power-up type
     */
    createCollectionEffect(x, y, color, type) {
        // Create particles
        const particles = [];
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            particles.push({
                x: Math.cos(angle),
                y: Math.sin(angle),
                size: 2 + Math.random() * 3
            });
        }
        
        // Get display text based on type
        let text;
        switch (type) {
            case 'rapidFire':
                text = 'RAPID FIRE!';
                break;
            case 'tripleShot':
                text = 'TRIPLE SHOT!';
                break;
            case 'shield':
                text = 'SHIELD!';
                break;
            default:
                text = 'POWER UP!';
        }
        
        // Add effect
        this.collectionEffects.push({
            x: x,
            y: y,
            color: color,
            baseSize: 30,
            duration: 1000,
            age: 0,
            particles: particles,
            text: text
        });
    }

    /**
     * Reset power-up manager
     */
    reset() {
        this.powerUps = [];
        this.collectionEffects = [];
        this.spawnTimer = 5000;
    }
}
