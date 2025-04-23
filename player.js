/**
 * Player class for the AI Defender game
 */
class Player {
    /**
     * Create a new player
     * @param {number} x - Initial x position
     * @param {number} y - Initial y position
     * @param {number} width - Player width
     * @param {number} height - Player height
     */
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 5;
        this.lives = 3;
        this.score = 0;
        this.isInvulnerable = false;
        this.invulnerabilityTime = 0;
        this.maxInvulnerabilityTime = 2000; // 2 seconds
        this.shootCooldown = 0;
        this.shootCooldownTime = 300; // 0.3 seconds
        this.powerUpTime = 0;
        this.maxPowerUpTime = 10000; // 10 seconds
        this.powerUpType = null;
        this.bullets = [];
        this.bulletSpeed = 8;
        this.bulletSize = 3;
        this.bulletColor = '#4a90e2';
        this.color = '#4a90e2';
        this.radius = Math.min(width, height) / 2;
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.isShooting = false;
    }

    /**
     * Update player state
     * @param {number} deltaTime - Time since last update in milliseconds
     * @param {number} canvasWidth - Canvas width
     */
    update(deltaTime, canvasWidth) {
        // Movement
        if (this.isMovingLeft) {
            this.x -= this.speed;
        }
        if (this.isMovingRight) {
            this.x += this.speed;
        }

        // Keep player within canvas bounds
        this.x = Utils.clamp(this.x, this.radius, canvasWidth - this.radius);

        // Update invulnerability
        if (this.isInvulnerable) {
            this.invulnerabilityTime += deltaTime;
            if (this.invulnerabilityTime >= this.maxInvulnerabilityTime) {
                this.isInvulnerable = false;
                this.invulnerabilityTime = 0;
            }
        }

        // Update power-up
        if (this.powerUpType) {
            this.powerUpTime += deltaTime;
            if (this.powerUpTime >= this.maxPowerUpTime) {
                this.powerUpType = null;
                this.powerUpTime = 0;
                this.shootCooldownTime = 300; // Reset to default
                this.bulletColor = '#4a90e2'; // Reset to default
            }
        }

        // Update shoot cooldown
        if (this.shootCooldown > 0) {
            this.shootCooldown -= deltaTime;
        }

        // Automatic shooting
        if (this.isShooting && this.shootCooldown <= 0) {
            this.shoot();
        }

        // Update bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.y -= this.bulletSpeed;

            // Remove bullets that are off screen
            if (bullet.y + bullet.radius < 0) {
                this.bullets.splice(i, 1);
            }
        }
    }

    /**
     * Draw player on canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        ctx.save();

        // Draw player ship
        ctx.beginPath();
        
        // If invulnerable, make player flash
        if (this.isInvulnerable && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        // Draw triangular ship
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.height / 2);
        ctx.lineTo(this.x - this.width / 2, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height / 2);
        ctx.closePath();
        
        // Fill with color based on power-up
        ctx.fillStyle = this.color;
        if (this.powerUpType === 'rapidFire') {
            ctx.fillStyle = '#ff9900'; // Orange for rapid fire
        } else if (this.powerUpType === 'tripleShot') {
            ctx.fillStyle = '#9900ff'; // Purple for triple shot
        } else if (this.powerUpType === 'shield') {
            ctx.fillStyle = '#00ff99'; // Green for shield
        }
        
        ctx.fill();
        
        // Draw shield if player has shield power-up
        if (this.powerUpType === 'shield') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 1.5, 0, Math.PI * 2);
            ctx.strokeStyle = '#00ff99';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Draw engine flame
        ctx.beginPath();
        ctx.moveTo(this.x - this.width / 4, this.y + this.height / 2);
        ctx.lineTo(this.x, this.y + this.height / 2 + 10);
        ctx.lineTo(this.x + this.width / 4, this.y + this.height / 2);
        ctx.closePath();
        ctx.fillStyle = '#ff3300';
        ctx.fill();

        // Draw bullets
        for (const bullet of this.bullets) {
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
            ctx.fillStyle = bullet.color || this.bulletColor;
            ctx.fill();
        }

        ctx.restore();
    }

    /**
     * Shoot a bullet
     */
    shoot() {
        if (this.shootCooldown <= 0) {
            // Create bullet based on power-up type
            if (this.powerUpType === 'tripleShot') {
                // Triple shot - three bullets in a spread
                this.bullets.push({
                    x: this.x - 10,
                    y: this.y - this.height / 2,
                    radius: this.bulletSize,
                    color: '#9900ff'
                });
                this.bullets.push({
                    x: this.x,
                    y: this.y - this.height / 2,
                    radius: this.bulletSize,
                    color: '#9900ff'
                });
                this.bullets.push({
                    x: this.x + 10,
                    y: this.y - this.height / 2,
                    radius: this.bulletSize,
                    color: '#9900ff'
                });
            } else {
                // Standard shot - single bullet
                this.bullets.push({
                    x: this.x,
                    y: this.y - this.height / 2,
                    radius: this.bulletSize,
                    color: this.bulletColor
                });
            }

            // Reset cooldown based on power-up
            if (this.powerUpType === 'rapidFire') {
                this.shootCooldown = 100; // Faster cooldown for rapid fire
            } else {
                this.shootCooldown = this.shootCooldownTime;
            }
        }
    }

    /**
     * Apply a power-up to the player
     * @param {string} type - Power-up type
     */
    applyPowerUp(type) {
        this.powerUpType = type;
        this.powerUpTime = 0;

        // Apply power-up effects
        switch (type) {
            case 'rapidFire':
                this.shootCooldownTime = 100; // Faster shooting
                this.bulletColor = '#ff9900';
                break;
            case 'tripleShot':
                this.bulletColor = '#9900ff';
                break;
            case 'shield':
                this.isInvulnerable = true;
                this.invulnerabilityTime = 0;
                break;
        }

        // Display AI fact related to power-up
        let category;
        switch (type) {
            case 'rapidFire':
                category = 'innovation';
                break;
            case 'tripleShot':
                category = 'fundamentals';
                break;
            case 'shield':
                category = 'education';
                break;
            default:
                category = null;
        }
        
        AIFactsManager.displayRandomFact(category);
    }

    /**
     * Handle player taking damage
     * @returns {boolean} True if player lost a life
     */
    takeDamage() {
        if (!this.isInvulnerable) {
            this.lives--;
            this.isInvulnerable = true;
            this.invulnerabilityTime = 0;
            this.powerUpType = null;
            this.powerUpTime = 0;
            this.shootCooldownTime = 300; // Reset to default
            this.bulletColor = '#4a90e2'; // Reset to default
            return true;
        }
        return false;
    }

    /**
     * Reset player to initial state
     * @param {number} x - Initial x position
     * @param {number} y - Initial y position
     */
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.lives = 3;
        this.score = 0;
        this.isInvulnerable = false;
        this.invulnerabilityTime = 0;
        this.shootCooldown = 0;
        this.powerUpType = null;
        this.powerUpTime = 0;
        this.bullets = [];
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.isShooting = false;
    }
}
