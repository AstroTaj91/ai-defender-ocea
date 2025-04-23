/**
 * Asteroids class for the AI Defender game
 */
class Asteroid {
    /**
     * Create a new asteroid
     * @param {number} x - Initial x position
     * @param {number} y - Initial y position
     * @param {number} size - Asteroid size (1=small, 2=medium, 3=large)
     * @param {number} speed - Movement speed
     */
    constructor(x, y, size, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        
        // Set radius based on size
        if (size === 1) {
            this.radius = 15;
            this.points = 100;
        } else if (size === 2) {
            this.radius = 30;
            this.points = 50;
        } else {
            this.radius = 45;
            this.points = 25;
        }
        
        // Random rotation and spin
        this.rotation = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.05;
        
        // Random movement angle
        this.angle = Math.random() * Math.PI * 2;
        this.velocityX = Math.sin(this.angle) * this.speed;
        this.velocityY = Math.cos(this.angle) * this.speed;
    }

    /**
     * Update asteroid position
     * @param {number} deltaTime - Time since last update in milliseconds
     * @param {number} canvasWidth - Canvas width
     * @param {number} canvasHeight - Canvas height
     */
    update(deltaTime, canvasWidth, canvasHeight) {
        // Move asteroid
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Rotate asteroid
        this.rotation += this.spin;
        
        // Wrap around screen edges
        if (this.x < -this.radius) {
            this.x = canvasWidth + this.radius;
        } else if (this.x > canvasWidth + this.radius) {
            this.x = -this.radius;
        }
        
        if (this.y < -this.radius) {
            this.y = canvasHeight + this.radius;
        } else if (this.y > canvasHeight + this.radius) {
            this.y = -this.radius;
        }
    }

    /**
     * Draw asteroid on canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        ctx.save();
        
        // Move to asteroid position and apply rotation
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Draw asteroid
        ctx.beginPath();
        
        // Create irregular polygon for asteroid shape
        const vertices = 8; // Number of vertices
        const roughness = 0.3; // Roughness factor
        
        for (let i = 0; i < vertices; i++) {
            const angle = (i / vertices) * Math.PI * 2;
            const distance = this.radius * (1 + (Math.random() * roughness * 2 - roughness));
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.closePath();
        
        // Fill and stroke
        ctx.fillStyle = '#555555';
        ctx.fill();
        ctx.strokeStyle = '#888888';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add some details (craters)
        const craterCount = this.size * 2;
        for (let i = 0; i < craterCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * this.radius * 0.6;
            const craterX = Math.cos(angle) * distance;
            const craterY = Math.sin(angle) * distance;
            const craterRadius = this.radius * 0.1 + Math.random() * this.radius * 0.1;
            
            ctx.beginPath();
            ctx.arc(craterX, craterY, craterRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#444444';
            ctx.fill();
        }
        
        ctx.restore();
    }

    /**
     * Break asteroid into smaller pieces
     * @returns {Array} Array of new smaller asteroids
     */
    break() {
        // Only break if not already the smallest size
        if (this.size > 1) {
            const newSize = this.size - 1;
            const newSpeed = this.speed * 1.2; // Smaller asteroids move faster
            const newAsteroids = [];
            
            // Create 2 smaller asteroids
            for (let i = 0; i < 2; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = this.radius * 0.5;
                const newX = this.x + Math.cos(angle) * distance;
                const newY = this.y + Math.sin(angle) * distance;
                
                newAsteroids.push(new Asteroid(newX, newY, newSize, newSpeed));
            }
            
            return newAsteroids;
        }
        
        return [];
    }
}

/**
 * AsteroidManager class for handling multiple asteroids
 */
class AsteroidManager {
    /**
     * Create a new asteroid manager
     * @param {number} canvasWidth - Canvas width
     * @param {number} canvasHeight - Canvas height
     */
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.asteroids = [];
        this.spawnRate = 2000; // Time between asteroid spawns in milliseconds
        this.spawnTimer = 0;
        this.maxAsteroids = 10; // Maximum number of asteroids on screen
        this.difficultyMultiplier = 1; // Increases as game progresses
    }

    /**
     * Update all asteroids
     * @param {number} deltaTime - Time since last update in milliseconds
     */
    update(deltaTime) {
        // Update spawn timer
        this.spawnTimer += deltaTime;
        
        // Spawn new asteroid if timer exceeds spawn rate and below max
        if (this.spawnTimer >= this.spawnRate && this.asteroids.length < this.maxAsteroids) {
            this.spawnAsteroid();
            this.spawnTimer = 0;
        }
        
        // Update all asteroids
        for (const asteroid of this.asteroids) {
            asteroid.update(deltaTime, this.canvasWidth, this.canvasHeight);
        }
    }

    /**
     * Draw all asteroids
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        for (const asteroid of this.asteroids) {
            asteroid.draw(ctx);
        }
    }

    /**
     * Spawn a new asteroid
     */
    spawnAsteroid() {
        // Determine asteroid size (weighted towards smaller asteroids as difficulty increases)
        let size;
        const rand = Math.random();
        if (rand < 0.3 * this.difficultyMultiplier) {
            size = 1; // Small
        } else if (rand < 0.6 * this.difficultyMultiplier) {
            size = 2; // Medium
        } else {
            size = 3; // Large
        }
        
        // Determine spawn position (outside the canvas)
        let x, y;
        if (Math.random() < 0.5) {
            // Spawn on left or right edge
            x = Math.random() < 0.5 ? -50 : this.canvasWidth + 50;
            y = Math.random() * this.canvasHeight;
        } else {
            // Spawn on top or bottom edge
            x = Math.random() * this.canvasWidth;
            y = Math.random() < 0.5 ? -50 : this.canvasHeight + 50;
        }
        
        // Determine speed based on size and difficulty
        const baseSpeed = 1 + (3 - size) * 0.5; // Smaller asteroids are faster
        const speed = baseSpeed * (1 + (this.difficultyMultiplier - 1) * 0.3);
        
        // Create and add asteroid
        this.asteroids.push(new Asteroid(x, y, size, speed));
    }

    /**
     * Check for collisions with player bullets
     * @param {Player} player - Player object
     * @returns {number} Score from destroyed asteroids
     */
    checkBulletCollisions(player) {
        let score = 0;
        
        // Check each asteroid against each bullet
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            const asteroid = this.asteroids[i];
            
            for (let j = player.bullets.length - 1; j >= 0; j--) {
                const bullet = player.bullets[j];
                
                // Check for collision
                if (Utils.circleCollision(
                    {x: asteroid.x, y: asteroid.y, radius: asteroid.radius},
                    {x: bullet.x, y: bullet.y, radius: bullet.radius}
                )) {
                    // Remove bullet
                    player.bullets.splice(j, 1);
                    
                    // Add score
                    score += asteroid.points;
                    
                    // Create explosion effect
                    Utils.createParticles(
                        document.getElementById('game-canvas').getContext('2d'),
                        asteroid.x,
                        asteroid.y,
                        15, // particle count
                        '#ffaa00', // color
                        2, // speed
                        3, // size
                        1000 // duration
                    );
                    
                    // Break asteroid into smaller pieces
                    const newAsteroids = asteroid.break();
                    this.asteroids.push(...newAsteroids);
                    
                    // Remove asteroid
                    this.asteroids.splice(i, 1);
                    
                    // Skip to next asteroid
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
        
        // Check each asteroid
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            const asteroid = this.asteroids[i];
            
            // Check for collision
            if (Utils.circleCollision(
                {x: asteroid.x, y: asteroid.y, radius: asteroid.radius},
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
        }
        
        return false;
    }

    /**
     * Increase difficulty
     * @param {number} amount - Amount to increase difficulty
     */
    increaseDifficulty(amount) {
        this.difficultyMultiplier += amount;
        this.spawnRate = Math.max(500, this.spawnRate - 100); // Decrease spawn rate (min 500ms)
        this.maxAsteroids = Math.min(20, this.maxAsteroids + 1); // Increase max asteroids (max 20)
    }

    /**
     * Reset asteroid manager
     */
    reset() {
        this.asteroids = [];
        this.spawnTimer = 0;
        this.spawnRate = 2000;
        this.maxAsteroids = 10;
        this.difficultyMultiplier = 1;
    }
}
