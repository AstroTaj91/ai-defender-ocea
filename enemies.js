/**
 * Enemies class for the AI Defender game
 */
class Enemy {
    /**
     * Create a new enemy
     * @param {number} x - Initial x position
     * @param {number} y - Initial y position
     * @param {string} type - Enemy type ('basic', 'tracker', 'shooter')
     * @param {number} canvasWidth - Canvas width for movement boundaries
     */
    constructor(x, y, type, canvasWidth) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.canvasWidth = canvasWidth;
        this.active = true;
        
        // Set properties based on type
        switch (type) {
            case 'basic':
                this.width = 30;
                this.height = 30;
                this.speed = 2;
                this.health = 1;
                this.points = 150;
                this.color = '#e74c3c'; // Red
                break;
            case 'tracker':
                this.width = 35;
                this.height = 25;
                this.speed = 1.5;
                this.health = 2;
                this.points = 250;
                this.color = '#9b59b6'; // Purple
                break;
            case 'shooter':
                this.width = 40;
                this.height = 40;
                this.speed = 1;
                this.health = 3;
                this.points = 350;
                this.color = '#e67e22'; // Orange
                this.shootCooldown = 0;
                this.shootCooldownTime = 2000; // 2 seconds
                this.bullets = [];
                this.bulletSpeed = 5;
                break;
            default:
                this.width = 30;
                this.height = 30;
                this.speed = 2;
                this.health = 1;
                this.points = 150;
                this.color = '#e74c3c'; // Red
        }
        
        this.radius = Math.max(this.width, this.height) / 2;
        
        // Movement pattern
        if (type === 'basic') {
            // Basic enemies move in a sine wave pattern
            this.baseX = x;
            this.amplitude = Utils.randomRange(30, 70);
            this.frequency = Utils.randomRange(50, 150) / 10000;
            this.phase = Utils.randomRange(0, 100) / 100 * Math.PI * 2;
        }
    }

    /**
     * Update enemy state
     * @param {number} deltaTime - Time since last update in milliseconds
     * @param {Player} player - Player object for tracking
     * @param {number} gameTime - Total game time in milliseconds
     * @returns {boolean} True if enemy is still active
     */
    update(deltaTime, player, gameTime) {
        if (!this.active) return false;
        
        // Movement based on type
        switch (this.type) {
            case 'basic':
                // Move downward in a sine wave pattern
                this.y += this.speed;
                this.x = this.baseX + Math.sin(gameTime * this.frequency + this.phase) * this.amplitude;
                break;
            case 'tracker':
                // Move toward player
                const dx = player.x - this.x;
                const dy = player.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 0) {
                    this.x += (dx / distance) * this.speed;
                    this.y += (dy / distance) * this.speed * 0.5; // Move down slower than horizontally
                }
                break;
            case 'shooter':
                // Move downward slowly
                this.y += this.speed;
                
                // Update shoot cooldown
                if (this.shootCooldown > 0) {
                    this.shootCooldown -= deltaTime;
                } else {
                    this.shoot(player);
                    this.shootCooldown = this.shootCooldownTime;
                }
                
                // Update bullets
                for (let i = this.bullets.length - 1; i >= 0; i--) {
                    const bullet = this.bullets[i];
                    bullet.y += this.bulletSpeed;
                    
                    // Remove bullets that are off screen
                    if (bullet.y > player.y + 100) {
                        this.bullets.splice(i, 1);
                    }
                }
                break;
        }
        
        // Deactivate if off screen
        if (this.y > player.y + 100) {
            this.active = false;
        }
        
        return this.active;
    }

    /**
     * Draw enemy on canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        if (!this.active) return;
        
        ctx.save();
        
        // Draw enemy based on type
        switch (this.type) {
            case 'basic':
                // Draw triangular ship pointing down
                ctx.beginPath();
                ctx.moveTo(this.x, this.y + this.height / 2);
                ctx.lineTo(this.x - this.width / 2, this.y - this.height / 2);
                ctx.lineTo(this.x + this.width / 2, this.y - this.height / 2);
                ctx.closePath();
                ctx.fillStyle = this.color;
                ctx.fill();
                
                // Add details
                ctx.beginPath();
                ctx.moveTo(this.x, this.y - this.height / 4);
                ctx.lineTo(this.x - this.width / 4, this.y - this.height / 2);
                ctx.lineTo(this.x + this.width / 4, this.y - this.height / 2);
                ctx.closePath();
                ctx.fillStyle = '#c0392b'; // Darker red
                ctx.fill();
                break;
            case 'tracker':
                // Draw diamond shape
                ctx.beginPath();
                ctx.moveTo(this.x, this.y - this.height / 2);
                ctx.lineTo(this.x + this.width / 2, this.y);
                ctx.lineTo(this.x, this.y + this.height / 2);
                ctx.lineTo(this.x - this.width / 2, this.y);
                ctx.closePath();
                ctx.fillStyle = this.color;
                ctx.fill();
                
                // Add details
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.width / 4, 0, Math.PI * 2);
                ctx.fillStyle = '#8e44ad'; // Darker purple
                ctx.fill();
                break;
            case 'shooter':
                // Draw hexagonal ship
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
                    const x = this.x + Math.cos(angle) * this.width / 2;
                    const y = this.y + Math.sin(angle) * this.height / 2;
                    
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
                ctx.fillStyle = this.color;
                ctx.fill();
                
                // Add details
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.width / 3, 0, Math.PI * 2);
                ctx.fillStyle = '#d35400'; // Darker orange
                ctx.fill();
                
                // Draw cannon
                ctx.beginPath();
                ctx.rect(this.x - 3, this.y, 6, this.height / 2);
                ctx.fillStyle = '#d35400'; // Darker orange
                ctx.fill();
                
                // Draw bullets
                for (const bullet of this.bullets) {
                    ctx.beginPath();
                    ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
                    ctx.fillStyle = '#f39c12'; // Yellow
                    ctx.fill();
                }
                break;
        }
        
        ctx.restore();
    }

    /**
     * Shoot a bullet at the player
     * @param {Player} player - Player object
     */
    shoot(player) {
        if (this.type === 'shooter') {
            this.bullets.push({
                x: this.x,
                y: this.y + this.height / 2,
                radius: 3
            });
        }
    }

    /**
     * Take damage
     * @param {number} amount - Amount of damage to take
     * @returns {boolean} True if enemy was destroyed
     */
    takeDamage(amount) {
        this.health -= amount;
        
        if (this.health <= 0) {
            this.active = false;
            return true;
        }
        
        return false;
    }

    /**
     * Check if enemy bullet collides with player
     * @param {Player} player - Player object
     * @returns {boolean} True if collision occurred
     */
    checkBulletCollision(player) {
        // Skip if player is invulnerable
        if (player.isInvulnerable) {
            return false;
        }
        
        // Check each bullet
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            // Check for collision
            if (Utils.circleCollision(
                {x: bullet.x, y: bullet.y, radius: bullet.radius},
                {x: player.x, y: player.y, radius: player.radius}
            )) {
                // Remove bullet
                this.bullets.splice(i, 1);
                return true;
            }
        }
        
        return false;
    }
}

/**
 * EnemyManager class for handling multiple enemies
 */
class EnemyManager {
    /**
     * Create a new enemy manager
     * @param {number} canvasWidth - Canvas width
     * @param {number} canvasHeight - Canvas height
     */
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.enemies = [];
        this.spawnRate = 5000; // Time between enemy spawns in milliseconds
        this.spawnTimer = 10000; // Start with a longer initial timer
        this.maxEnemies = 5; // Maximum number of enemies on screen
        this.difficultyMultiplier = 1; // Increases as game progresses
        this.gameTime = 0; // Total game time in milliseconds
    }

    /**
     * Update all enemies
     * @param {number} deltaTime - Time since last update in milliseconds
     * @param {Player} player - Player object
     */
    update(deltaTime, player) {
        // Update game time
        this.gameTime += deltaTime;
        
        // Update spawn timer
        this.spawnTimer += deltaTime;
        
        // Spawn new enemy if timer exceeds spawn rate and below max
        if (this.spawnTimer >= this.spawnRate && this.enemies.length < this.maxEnemies) {
            this.spawnEnemy();
            this.spawnTimer = 0;
        }
        
        // Update all enemies and remove inactive ones
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            if (!enemy.update(deltaTime, player, this.gameTime)) {
                this.enemies.splice(i, 1);
            }
        }
    }

    /**
     * Draw all enemies
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        for (const enemy of this.enemies) {
            enemy.draw(ctx);
        }
    }

    /**
     * Spawn a new enemy
     */
    spawnEnemy() {
        // Determine enemy type based on difficulty
        let type;
        const rand = Math.random();
        
        if (this.difficultyMultiplier < 1.5) {
            // Early game: mostly basic enemies
            if (rand < 0.8) {
                type = 'basic';
            } else if (rand < 0.9) {
                type = 'tracker';
            } else {
                type = 'shooter';
            }
        } else if (this.difficultyMultiplier < 2.5) {
            // Mid game: more varied enemies
            if (rand < 0.5) {
                type = 'basic';
            } else if (rand < 0.8) {
                type = 'tracker';
            } else {
                type = 'shooter';
            }
        } else {
            // Late game: more advanced enemies
            if (rand < 0.3) {
                type = 'basic';
            } else if (rand < 0.7) {
                type = 'tracker';
            } else {
                type = 'shooter';
            }
        }
        
        // Determine spawn position
        const x = Utils.randomRange(50, this.canvasWidth - 50);
        const y = -50; // Start above the canvas
        
        // Create and add enemy
        this.enemies.push(new Enemy(x, y, type, this.canvasWidth));
    }

    /**
     * Check for collisions with player bullets
     * @param {Player} player - Player object
     * @returns {number} Score from destroyed enemies
     */
    checkBulletCollisions(player) {
        let score = 0;
        
        // Check each enemy against each bullet
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            for (let j = player.bullets.length - 1; j >= 0; j--) {
                const bullet = player.bullets[j];
                
                // Check for collision
                if (Utils.circleCollision(
                    {x: enemy.x, y: enemy.y, radius: enemy.radius},
                    {x: bullet.x, y: bullet.y, radius: bullet.radius}
                )) {
                    // Remove bullet
                    player.bullets.splice(j, 1);
                    
                    // Damage enemy
                    if (enemy.takeDamage(1)) {
                        // Enemy destroyed
                        score += enemy.points;
                        
                        // Create explosion effect
                        Utils.createParticles(
                            document.getElementById('game-canvas').getContext('2d'),
                            enemy.x,
                            enemy.y,
                            20, // particle count
                            enemy.color, // color
                            3, // speed
                            4, // size
                            1500 // duration
                        );
                        
                        // Remove enemy
                        this.enemies.splice(i, 1);
                    }
                    
                    // Skip to next enemy
                    break;
                }
            }
        }
        
        return score;
    }

    /**
     * Check for collisions with player
     * @param {Player} player - Player object
     * @returns {boolean} True if collision occurred
     */
    checkPlayerCollision(player) {
        // Skip if player is invulnerable
        if (player.isInvulnerable) {
            return false;
        }
        
        // Check each enemy
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Check for collision with enemy body
            if (Utils.circleCollision(
                {x: enemy.x, y: enemy.y, radius: enemy.radius},
                {x: player.x, y: player.y, radius: player.radius}
            )) {
                // Create explosion effect
                Utils.createParticles(
                    document.getElementById('game-canvas').getContext('2d'),
                    player.x,
                    player.y,
                    20, // particle count
                    '#ff0000', // color
                    3, // speed
                    4, // size
                    1500 // duration
                );
                
                return true;
            }
            
            // Check for collision with enemy bullets
            if (enemy.type === 'shooter' && enemy.checkBulletCollision(player)) {
                // Create explosion effect
                Utils.createParticles(
                    document.getElementById('game-canvas').getContext('2d'),
                    player.x,
                    player.y,
                    10, // particle count
                    '#ff0000', // color
                    2, // speed
                    3, // size
                    1000 // duration
                );
                
                return true;
            }
        }
        
        return false;
    }

    /**
     * Increase difficulty
     * @param {number} amount - Amount to increase difficulty
     */
    increaseDifficulty(amount) {
        this.difficultyMultiplier += amount;
        this.spawnRate = Math.max(1500, this.spawnRate - 300); // Decrease spawn rate (min 1500ms)
        this.maxEnemies = Math.min(10, this.maxEnemies + 1); // Increase max enemies (max 10)
    }

    /**
     * Reset enemy manager
     */
    reset() {
        this.enemies = [];
        this.spawnTimer = 10000;
        this.spawnRate = 5000;
        this.maxEnemies = 5;
        this.difficultyMultiplier = 1;
        this.gameTime = 0;
    }
}
